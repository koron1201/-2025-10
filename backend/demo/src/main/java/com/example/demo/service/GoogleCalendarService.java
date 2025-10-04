package com.example.demo.service;

import com.example.demo.dto.GoogleCalendarIntegrationRequest;
import com.example.demo.dto.GoogleCalendarIntegrationResponse;
import com.example.demo.model.User;
import com.example.demo.repository.UserRepository;
import com.google.api.client.googleapis.auth.oauth2.GoogleCredential;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.jackson2.JacksonFactory;
import com.google.api.services.calendar.Calendar;
import com.google.api.services.calendar.model.Event;
import com.google.api.services.calendar.model.EventAttendee;
import com.google.api.services.calendar.model.EventDateTime;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.List;

@Service
public class GoogleCalendarService {

    private final UserRepository userRepository;

    public GoogleCalendarService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Value("${google.client.id}")
    private String clientId;

    @Value("${google.client.secret}")
    private String clientSecret;

    public GoogleCalendarIntegrationResponse createEvent(GoogleCalendarIntegrationRequest request) {
        GoogleCalendarIntegrationResponse response = new GoogleCalendarIntegrationResponse();

        // 入力バリデーション
        if (request.getTitle() == null || request.getTitle().isBlank()) {
            response.setStatus("error");
            response.setErrorMessage("title は必須です");
            return response;
        }
        if (request.getStartIso() == null || request.getStartIso().isBlank()) {
            response.setStatus("error");
            response.setErrorMessage("startIso は必須です");
            return response;
        }
        if (request.getEndIso() == null || request.getEndIso().isBlank()) {
            response.setStatus("error");
            response.setErrorMessage("endIso は必須です");
            return response;
        }

        // 認証済みユーザー（refresh token保持者）を1件取得
        User user = userRepository.findAll().stream()
                .filter(u -> u.getRefreshToken() != null && !u.getRefreshToken().isBlank())
                .findFirst()
                .orElse(null);

        if (user == null) {
            response.setStatus("error");
            response.setErrorMessage("認証済みユーザーが見つかりません");
            return response;
        }

        try {
            // Google 認証クレデンシャル
            GoogleCredential credential = new GoogleCredential.Builder()
                    .setClientSecrets(clientId, clientSecret)
                    .setTransport(new NetHttpTransport())
                    .setJsonFactory(JacksonFactory.getDefaultInstance())
                    .build()
                    .setRefreshToken(user.getRefreshToken());

            Calendar service = new Calendar.Builder(new NetHttpTransport(), JacksonFactory.getDefaultInstance(), credential)
                    .setApplicationName("Mail AI Calendar Integration")
                    .build();

            // イベントオブジェクトの作成
            Event event = new Event()
                    .setSummary(request.getTitle())
                    .setDescription(request.getDescription())
                    .setStart(new EventDateTime().setDateTime(new com.google.api.client.util.DateTime(request.getStartIso())))
                    .setEnd(new EventDateTime().setDateTime(new com.google.api.client.util.DateTime(request.getEndIso())));

            if (request.getAttendees() != null && !request.getAttendees().isEmpty()) {
                List<EventAttendee> attendees = request.getAttendees().stream()
                        .map(email -> new EventAttendee().setEmail(email))
                        .toList();
                event.setAttendees(attendees);
            }

            // Google カレンダーにイベント作成
            Event created = service.events().insert("primary", event).execute();

            response.setStatus("ok");
            response.setEventId(created.getId());
            return response;
        } catch (IOException e) {
            response.setStatus("error");
            response.setErrorMessage("Google Calendar API呼び出しエラー: " + e.getMessage());
            return response;
        } catch (Exception e) {
            response.setStatus("error");
            response.setErrorMessage("予期しないエラー: " + e.getMessage());
            return response;
        }
    }
}

