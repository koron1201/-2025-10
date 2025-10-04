package com.example.demo.config;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.stereotype.Component;

import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.time.OffsetDateTime;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeFormatterBuilder;
import java.time.temporal.ChronoField;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

/**
 * 既存 DB で文字列として保存されている history.timestamp を、アプリ起動時に DATETIME(6) へ正規化する。
 */
@Component
public class HistoryTimestampMigration implements ApplicationRunner {

    private static final Logger log = LoggerFactory.getLogger(HistoryTimestampMigration.class);

    private final JdbcTemplate jdbcTemplate;

    public HistoryTimestampMigration(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    @Override
    public void run(ApplicationArguments args) {
        try {
            ColumnMeta meta = jdbcTemplate.query(
                    "SELECT DATA_TYPE, COLUMN_TYPE, IS_NULLABLE FROM information_schema.COLUMNS " +
                            "WHERE TABLE_SCHEMA = DATABASE() AND TABLE_NAME = 'history' AND COLUMN_NAME = 'timestamp'",
                    rs -> rs.next() ? new ColumnMeta(
                            rs.getString("DATA_TYPE"),
                            rs.getString("COLUMN_TYPE"),
                            rs.getString("IS_NULLABLE")) : null
            );

            if (meta == null) {
                log.warn("history.timestamp が見つかりません。マイグレーションをスキップします。");
                return;
            }

            if ("datetime".equalsIgnoreCase(meta.dataType())) {
                return; // 既に DATETIME のため何もしない
            }

            log.info("Normalizing history.timestamp textual data (current type: {})", meta.columnType());

            List<Map<String, Object>> rows = jdbcTemplate.queryForList(
                    "SELECT id, timestamp FROM history WHERE timestamp IS NOT NULL"
            );

            int converted = 0;
            List<Long> failedIds = new ArrayList<>();

            for (Map<String, Object> row : rows) {
                Object idObj = row.get("id");
                Object tsObj = row.get("timestamp");

                if (!(idObj instanceof Number)) {
                    continue;
                }
                long id = ((Number) idObj).longValue();

                if (tsObj == null) {
                    continue;
                }

                if (tsObj instanceof Timestamp) {
                    // 既に Timestamp の場合は変換不要
                    converted++;
                    continue;
                }

                String raw = tsObj.toString().trim();
                if (raw.isEmpty()) {
                    continue;
                }

                Timestamp parsed = convertToTimestamp(raw);
                if (parsed == null) {
                    failedIds.add(id);
                    continue;
                }

                jdbcTemplate.update("UPDATE history SET timestamp = ? WHERE id = ?", parsed, id);
                converted++;
            }

            log.info("history.timestamp normalized {}/{} rows", converted, rows.size());

            if (!failedIds.isEmpty()) {
                log.error("history.timestamp 正規化に失敗したレコードID: {}", failedIds.size() > 10 ? failedIds.subList(0, 10) : failedIds);
                return;
            }

            String nullClause = "YES".equalsIgnoreCase(meta.isNullable()) ? " NULL" : " NOT NULL";

            log.info("history.timestamp 列型を DATETIME(6) に変更します。");
            jdbcTemplate.execute("ALTER TABLE history MODIFY COLUMN timestamp DATETIME(6)" + nullClause);
            log.info("history.timestamp migration finished.");
        } catch (Exception e) {
            log.error("history.timestamp migration failed", e);
        }
    }

    private Timestamp convertToTimestamp(String raw) {
        try {
            if (raw.endsWith("Z") || raw.matches(".*[+-][0-9:]{3,6}$")) {
                OffsetDateTime offset = OffsetDateTime.parse(raw, ISO8601_WITH_OPTIONAL_FRACTION);
                return Timestamp.valueOf(offset.atZoneSameInstant(ZoneId.systemDefault()).toLocalDateTime());
            }

            if (raw.contains("T")) {
                LocalDateTime local = LocalDateTime.parse(raw, ISO8601_LOCAL);
                return Timestamp.valueOf(local);
            }

            if (raw.matches("^[0-9]{4}-[0-9]{2}-[0-9]{2} [0-9]{2}:[0-9]{2}:[0-9]{2}\\.[0-9]+$")) {
                LocalDateTime local = LocalDateTime.parse(raw, SPACE_SEPARATED_MILLIS);
                return Timestamp.valueOf(local);
            }

            if (raw.matches("^[0-9]{4}-[0-9]{2}-[0-9]{2} [0-9]{2}:[0-9]{2}:[0-9]{2}$")) {
                LocalDateTime local = LocalDateTime.parse(raw, SPACE_SEPARATED_SECONDS);
                return Timestamp.valueOf(local);
            }
        } catch (Exception ignore) {
            // fall through to return null
        }
        return null;
    }

    private static final DateTimeFormatter ISO8601_WITH_OPTIONAL_FRACTION = new DateTimeFormatterBuilder()
            .append(DateTimeFormatter.ISO_LOCAL_DATE)
            .appendLiteral('T')
            .appendValue(ChronoField.HOUR_OF_DAY, 2)
            .appendLiteral(':')
            .appendValue(ChronoField.MINUTE_OF_HOUR, 2)
            .appendLiteral(':')
            .appendValue(ChronoField.SECOND_OF_MINUTE, 2)
            .appendFraction(ChronoField.MICRO_OF_SECOND, 0, 6, true)
            .appendOffsetId()
            .toFormatter();

    private static final DateTimeFormatter ISO8601_LOCAL = new DateTimeFormatterBuilder()
            .append(DateTimeFormatter.ISO_LOCAL_DATE)
            .appendLiteral('T')
            .appendValue(ChronoField.HOUR_OF_DAY, 2)
            .appendLiteral(':')
            .appendValue(ChronoField.MINUTE_OF_HOUR, 2)
            .appendLiteral(':')
            .appendValue(ChronoField.SECOND_OF_MINUTE, 2)
            .appendFraction(ChronoField.MICRO_OF_SECOND, 0, 6, true)
            .toFormatter();

    private static final DateTimeFormatter SPACE_SEPARATED_MILLIS = new DateTimeFormatterBuilder()
            .appendPattern("yyyy-MM-dd HH:mm:ss")
            .appendFraction(ChronoField.MICRO_OF_SECOND, 1, 6, true)
            .toFormatter();

    private static final DateTimeFormatter SPACE_SEPARATED_SECONDS = new DateTimeFormatterBuilder()
            .appendPattern("yyyy-MM-dd HH:mm:ss")
            .toFormatter();

    private record ColumnMeta(String dataType, String columnType, String isNullable) {
    }
}


