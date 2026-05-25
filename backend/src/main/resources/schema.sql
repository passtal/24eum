-- ================================================================
-- 24eum DB Schema (MySQL 8.x, utf8mb4)
-- README 및 각 DTO/Mapper 주석에 명시된 명세를 기반으로 작성한 초안
-- 팀 ERD 확정 후 컬럼/타입은 자유롭게 조정해도 됨
-- ================================================================

SET NAMES utf8mb4;
SET FOREIGN_KEY_CHECKS = 0;

DROP TABLE IF EXISTS persistent_logins;
DROP TABLE IF EXISTS user_bans;
DROP TABLE IF EXISTS ai_search_logs;
DROP TABLE IF EXISTS reviews;
DROP TABLE IF EXISTS contractor_likes;
DROP TABLE IF EXISTS chat_messages;
DROP TABLE IF EXISTS chat_rooms;
DROP TABLE IF EXISTS matching_results;
DROP TABLE IF EXISTS estimate_requests;
DROP TABLE IF EXISTS contractors;
DROP TABLE IF EXISTS design_models;
DROP TABLE IF EXISTS users;

SET FOREIGN_KEY_CHECKS = 1;

-- ----------------------------------------------------------------
-- users : 사용자
-- ----------------------------------------------------------------
CREATE TABLE users (
    id              BIGINT       NOT NULL AUTO_INCREMENT,
    email           VARCHAR(120) NOT NULL,
    password        VARCHAR(120) NULL,                  -- 카카오 가입은 NULL
    nickname        VARCHAR(60)  NOT NULL,
    phone           VARCHAR(30)  NULL,
    role            VARCHAR(20)  NOT NULL DEFAULT 'USER',  -- USER / OWNER / ADMIN
    provider        VARCHAR(20)  NOT NULL DEFAULT 'LOCAL', -- LOCAL / KAKAO
    provider_id     VARCHAR(120) NULL,
    profile_image   VARCHAR(500) NULL,
    is_banned       TINYINT(1)   NOT NULL DEFAULT 0,
    banned_at       DATETIME     NULL,
    banned_reason   VARCHAR(500) NULL,
    created_at      DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at      DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    UNIQUE KEY uk_users_email (email),
    UNIQUE KEY uk_users_provider (provider, provider_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------
-- design_models : 인테리어 디자인 모델 (A/B/C/D)
-- ----------------------------------------------------------------
CREATE TABLE design_models (
    id              BIGINT       NOT NULL AUTO_INCREMENT,
    model_code      VARCHAR(10)  NOT NULL,              -- A / B / C / D
    name            VARCHAR(120) NOT NULL,
    description     TEXT         NULL,
    thumbnail_image VARCHAR(500) NULL,
    detail_images   TEXT         NULL,                  -- JSON 배열 문자열
    base_price      BIGINT       NOT NULL DEFAULT 0,
    category        VARCHAR(60)  NULL,
    style_keywords  VARCHAR(500) NULL,                  -- comma separated
    created_at      DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at      DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    UNIQUE KEY uk_design_model_code (model_code)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------
-- contractors : 시공업자
-- ----------------------------------------------------------------
CREATE TABLE contractors (
    id                BIGINT       NOT NULL AUTO_INCREMENT,
    user_id           BIGINT       NOT NULL,
    company_name      VARCHAR(120) NOT NULL,
    business_number   VARCHAR(30)  NULL,
    career            INT          NOT NULL DEFAULT 0,
    certifications    VARCHAR(500) NULL,                -- comma separated
    preferred_types   VARCHAR(500) NULL,                -- comma separated (A/B/C/D 등)
    service_area      VARCHAR(255) NULL,                -- comma separated 지역
    introduction      TEXT         NULL,
    portfolio_images  TEXT         NULL,
    average_rating    DECIMAL(3,2) NOT NULL DEFAULT 0.00,
    review_count      INT          NOT NULL DEFAULT 0,
    is_banned         TINYINT(1)   NOT NULL DEFAULT 0,
    created_at        DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at        DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    KEY ix_contractors_user (user_id),
    CONSTRAINT fk_contractors_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------
-- estimate_requests : 견적 요청
-- ----------------------------------------------------------------
CREATE TABLE estimate_requests (
    id               BIGINT       NOT NULL AUTO_INCREMENT,
    user_id          BIGINT       NOT NULL,
    design_model_id  BIGINT       NULL,
    budget           BIGINT       NOT NULL DEFAULT 0,
    area             DECIMAL(8,2) NOT NULL DEFAULT 0.00, -- 평수
    address          VARCHAR(255) NULL,
    description      TEXT         NULL,
    status           VARCHAR(30)  NOT NULL DEFAULT 'PENDING', -- PENDING/MATCHED/IN_PROGRESS/COMPLETED/CANCELLED
    created_at       DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at       DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    KEY ix_estimate_user (user_id),
    KEY ix_estimate_design (design_model_id),
    CONSTRAINT fk_estimate_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_estimate_design FOREIGN KEY (design_model_id) REFERENCES design_models(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------
-- matching_results : 매칭 결과 (Top 5)
-- (NOTE) `rank` 는 MySQL 8 예약어라 컬럼명을 match_rank 로 사용
-- ----------------------------------------------------------------
CREATE TABLE matching_results (
    id                   BIGINT      NOT NULL AUTO_INCREMENT,
    estimate_request_id  BIGINT      NOT NULL,
    contractor_id        BIGINT      NOT NULL,
    match_score          DECIMAL(6,2) NOT NULL DEFAULT 0.00,
    match_rank           INT         NOT NULL,         -- 1~5
    status               VARCHAR(30) NOT NULL DEFAULT 'RECOMMENDED', -- RECOMMENDED/SELECTED/REJECTED
    created_at           DATETIME    NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    KEY ix_matching_estimate (estimate_request_id),
    KEY ix_matching_contractor (contractor_id),
    CONSTRAINT fk_matching_estimate FOREIGN KEY (estimate_request_id) REFERENCES estimate_requests(id) ON DELETE CASCADE,
    CONSTRAINT fk_matching_contractor FOREIGN KEY (contractor_id) REFERENCES contractors(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------
-- chat_rooms : 1:1 채팅방
-- ----------------------------------------------------------------
CREATE TABLE chat_rooms (
    id                   BIGINT       NOT NULL AUTO_INCREMENT,
    user_id              BIGINT       NOT NULL,
    contractor_id        BIGINT       NOT NULL,
    estimate_request_id  BIGINT       NULL,
    last_message         VARCHAR(500) NULL,
    last_message_at      DATETIME     NULL,
    created_at           DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    UNIQUE KEY uk_chat_room_pair (user_id, contractor_id, estimate_request_id),
    KEY ix_chat_rooms_user (user_id),
    KEY ix_chat_rooms_contractor (contractor_id),
    CONSTRAINT fk_chat_rooms_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_chat_rooms_contractor FOREIGN KEY (contractor_id) REFERENCES contractors(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------
-- chat_messages : 채팅 메시지
-- ----------------------------------------------------------------
CREATE TABLE chat_messages (
    id            BIGINT       NOT NULL AUTO_INCREMENT,
    chat_room_id  BIGINT       NOT NULL,
    sender_id     BIGINT       NOT NULL,
    message_type  VARCHAR(20)  NOT NULL DEFAULT 'TEXT', -- TEXT/IMAGE/FILE
    content       TEXT         NULL,
    file_url      VARCHAR(500) NULL,
    is_read       TINYINT(1)   NOT NULL DEFAULT 0,
    created_at    DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    KEY ix_chat_messages_room (chat_room_id),
    CONSTRAINT fk_chat_messages_room FOREIGN KEY (chat_room_id) REFERENCES chat_rooms(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------
-- contractor_likes : 찜
-- ----------------------------------------------------------------
CREATE TABLE contractor_likes (
    id             BIGINT   NOT NULL AUTO_INCREMENT,
    user_id        BIGINT   NOT NULL,
    contractor_id  BIGINT   NOT NULL,
    created_at     DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    UNIQUE KEY uk_like_pair (user_id, contractor_id),
    CONSTRAINT fk_like_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_like_contractor FOREIGN KEY (contractor_id) REFERENCES contractors(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------
-- reviews : 리뷰
-- ----------------------------------------------------------------
CREATE TABLE reviews (
    id                   BIGINT       NOT NULL AUTO_INCREMENT,
    user_id              BIGINT       NOT NULL,
    contractor_id        BIGINT       NOT NULL,
    estimate_request_id  BIGINT       NULL,
    rating               TINYINT      NOT NULL,         -- 1~5
    content              TEXT         NULL,
    images               TEXT         NULL,             -- JSON 배열 문자열
    is_hidden            TINYINT(1)   NOT NULL DEFAULT 0,
    created_at           DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at           DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    KEY ix_reviews_contractor (contractor_id),
    KEY ix_reviews_user (user_id),
    CONSTRAINT fk_reviews_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_reviews_contractor FOREIGN KEY (contractor_id) REFERENCES contractors(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------
-- ai_search_logs : AI 검색 로그
-- ----------------------------------------------------------------
CREATE TABLE ai_search_logs (
    id          BIGINT   NOT NULL AUTO_INCREMENT,
    user_id     BIGINT   NULL,
    query       VARCHAR(1000) NOT NULL,
    response    TEXT     NULL,
    created_at  DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (id),
    KEY ix_ai_log_user (user_id),
    CONSTRAINT fk_ai_log_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------
-- user_bans : 회원 차단 이력
-- ----------------------------------------------------------------
CREATE TABLE user_bans (
    id           BIGINT       NOT NULL AUTO_INCREMENT,
    user_id      BIGINT       NOT NULL,
    banned_by    BIGINT       NOT NULL,
    reason       VARCHAR(500) NULL,
    banned_at    DATETIME     NOT NULL DEFAULT CURRENT_TIMESTAMP,
    unbanned_at  DATETIME     NULL,
    PRIMARY KEY (id),
    KEY ix_user_bans_user (user_id),
    CONSTRAINT fk_user_bans_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    CONSTRAINT fk_user_bans_admin FOREIGN KEY (banned_by) REFERENCES users(id) ON DELETE CASCADE
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ----------------------------------------------------------------
-- persistent_logins : Remember-Me
-- ----------------------------------------------------------------
CREATE TABLE persistent_logins (
    series     VARCHAR(64)  NOT NULL,
    username   VARCHAR(120) NOT NULL,
    token      VARCHAR(64)  NOT NULL,
    last_used  DATETIME     NOT NULL,
    PRIMARY KEY (series)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
