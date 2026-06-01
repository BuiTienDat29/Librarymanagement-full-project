package com.library.config;

import lombok.RequiredArgsConstructor;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
@EnableWebSecurity
@EnableMethodSecurity
@RequiredArgsConstructor
public class SecurityConfig {

    // Inject trực tiếp UserDetailsServiceImpl (không phải interface) → phá được vòng tròn
    private final JwtAuthenticationFilter  jwtAuthFilter;
    private final UserDetailsServiceImpl   userDetailsService;

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .csrf(AbstractHttpConfigurer::disable)
            .cors(cors -> cors.configurationSource(corsConfigurationSource()))
            .sessionManagement(session ->
                session.sessionCreationPolicy(SessionCreationPolicy.STATELESS))
            .authorizeHttpRequests(auth -> auth
                // ── Public ────────────────────────────────────
                .requestMatchers("/api/auth/**").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/books/**").permitAll()
                .requestMatchers(HttpMethod.GET, "/api/categories/**").permitAll()

                // ── Student+ ──────────────────────────────────
                .requestMatchers("/api/borrow/my-history").hasAnyRole("STUDENT","LIBRARIAN","ADMIN")
                .requestMatchers("/api/fines/my-fines").hasAnyRole("STUDENT","LIBRARIAN","ADMIN")
                .requestMatchers("/api/reservations/my").hasAnyRole("STUDENT","LIBRARIAN","ADMIN")
                .requestMatchers("/api/users/profile/**").hasAnyRole("STUDENT","LIBRARIAN","ADMIN")

                // ── Librarian+ ────────────────────────────────
                .requestMatchers(HttpMethod.POST, "/api/books/**").hasAnyRole("LIBRARIAN","ADMIN")
                .requestMatchers(HttpMethod.PUT,  "/api/books/**").hasAnyRole("LIBRARIAN","ADMIN")
                .requestMatchers(HttpMethod.POST, "/api/categories/**").hasAnyRole("LIBRARIAN","ADMIN")
                .requestMatchers(HttpMethod.PUT,  "/api/categories/**").hasAnyRole("LIBRARIAN","ADMIN")
                .requestMatchers("/api/borrow/active").hasAnyRole("LIBRARIAN","ADMIN")
                .requestMatchers("/api/borrow/overdue").hasAnyRole("LIBRARIAN","ADMIN")
                .requestMatchers("/api/fines/**").hasAnyRole("LIBRARIAN","ADMIN")
                .requestMatchers("/api/reports/**").hasAnyRole("LIBRARIAN","ADMIN")
                .requestMatchers("/api/reservations").hasAnyRole("LIBRARIAN","ADMIN")

                // ── Admin only ────────────────────────────────
                .requestMatchers(HttpMethod.DELETE, "/api/books/**").hasRole("ADMIN")
                .requestMatchers(HttpMethod.DELETE, "/api/categories/**").hasRole("ADMIN")
                .requestMatchers("/api/users/**").hasRole("ADMIN")

                .anyRequest().authenticated()
            )
            .authenticationProvider(authenticationProvider())
            .addFilterBefore(jwtAuthFilter, UsernamePasswordAuthenticationFilter.class);

        return http.build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration config = new CorsConfiguration();
        config.setAllowedOrigins(List.of("http://localhost:3000"));
        config.setAllowedMethods(List.of("GET","POST","PUT","DELETE","OPTIONS"));
        config.setAllowedHeaders(List.of("*"));
        config.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/api/**", config);
        return source;
    }

    @Bean
    public AuthenticationProvider authenticationProvider() {
        DaoAuthenticationProvider provider = new DaoAuthenticationProvider();
        provider.setUserDetailsService(userDetailsService);
        provider.setPasswordEncoder(passwordEncoder());
        return provider;
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration config)
            throws Exception {
        return config.getAuthenticationManager();
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder(12);
    }
}
