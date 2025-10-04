package com.example.demo.controller;

import com.example.demo.model.User;
import com.example.demo.repository.UserRepository;
import com.google.api.client.googleapis.auth.oauth2.GoogleAuthorizationCodeTokenRequest;
import com.google.api.client.googleapis.auth.oauth2.GoogleTokenResponse;
import com.google.api.client.googleapis.auth.oauth2.GoogleCredential;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.client.json.jackson2.JacksonFactory;
import com.google.api.services.calendar.Calendar;
import com.google.api.services.calendar.model.Event;
import com.google.api.services.calendar.model.EventDateTime;
import com.google.api.services.calendar.model.Events;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/calendar")
public class GoogleCalendarController {

    @Autowired
    private UserRepository userRepository;

    @Value("${google.client.id}")
    private String clientId;

    @Value("${google.client.secret}")
    private String clientSecret;

    @Value("${google.redirect.uri}")
    private String redirectUri;

    // OAuth URL 生成
    @GetMapping("/oauth/url")
    public String getOAuthUrl() {
        String scope = URLEncoder.encode("https://www.googleapis.com/auth/calendar", StandardCharsets.UTF_8);
        String encodedRedirectUri = URLEncoder.encode(redirectUri, StandardCharsets.UTF_8); // ✅ 修正
        String state = UUID.randomUUID().toString(); // CSRF対策

        return "https://accounts.google.com/o/oauth2/v2/auth" +
                "?client_id=" + clientId +
                "&redirect_uri=" + encodedRedirectUri +
                "&response_type=code" +
                "&scope=" + scope +
                "&access_type=offline" +
                "&state=" + state;
    }

    // コールバック
    @GetMapping("/oauth/callback")
    public String oauthCallback(@RequestParam String code, @RequestParam String state) throws IOException {
        GoogleTokenResponse tokenResponse = new GoogleAuthorizationCodeTokenRequest(
                new NetHttpTransport(),
                JacksonFactory.getDefaultInstance(),
                clientId,
                clientSecret,
                code,
                redirectUri
        ).execute();

        String refreshToken = tokenResponse.getRefreshToken();

        // state を仮のユーザー識別子として利用
        User user = userRepository.findByEmail(state).orElseGet(() -> new User(state));
        user.setRefreshToken(refreshToken);
        userRepository.save(user);

        return "Google Calendar connected successfully!";
    }

    // 予定取得
    @GetMapping("/events")
    public List<Event> getEvents(@RequestParam String email) throws IOException {
        User user = userRepository.findByEmail(email).orElseThrow(() -> new RuntimeException("User not found"));

        GoogleCredential credential = new GoogleCredential.Builder()
                .setClientSecrets(clientId, clientSecret)
                .setTransport(new NetHttpTransport())
                .setJsonFactory(JacksonFactory.getDefaultInstance())
                .build()
                .setRefreshToken(user.getRefreshToken());

        Calendar service = new Calendar.Builder(new NetHttpTransport(), JacksonFactory.getDefaultInstance(), credential)
                .setApplicationName("My Calendar App")
                .build();

        Events events = service.events().list("primary")
                .setMaxResults(10)
                .setOrderBy("startTime")
                .setSingleEvents(true)
                .execute();

        return events.getItems();
    }

    // 予定作成
    @PostMapping("/events")
    public String createEvent(@RequestParam String email,
                              @RequestParam String summary,
                              @RequestParam String startDateTime,
                              @RequestParam String endDateTime) throws IOException {
        User user = userRepository.findByEmail(email).orElseThrow(() -> new RuntimeException("User not found"));

        GoogleCredential credential = new GoogleCredential.Builder()
                .setClientSecrets(clientId, clientSecret)
                .setTransport(new NetHttpTransport())
                .setJsonFactory(JacksonFactory.getDefaultInstance())
                .build()
                .setRefreshToken(user.getRefreshToken());

        Calendar service = new Calendar.Builder(new NetHttpTransport(), JacksonFactory.getDefaultInstance(), credential)
                .setApplicationName("My Calendar App")
                .build();

        Event event = new Event()
                .setSummary(summary)
                .setStart(new EventDateTime().setDateTime(new com.google.api.client.util.DateTime(startDateTime)))
                .setEnd(new EventDateTime().setDateTime(new com.google.api.client.util.DateTime(endDateTime)));

        service.events().insert("primary", event).execute();

        return "Event created successfully!";
    }
}
