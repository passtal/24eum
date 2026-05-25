-- ================================================================
-- 24eum 초기 시드 데이터
-- - 디자인 모델 A/B/C/D
-- - 관리자 계정 (admin@24eum.com / admin1234 - BCrypt 인코딩됨)
-- - 샘플 시공업자 6명 (매칭 알고리즘 테스트용)
-- ================================================================

-- ----------------------------------------------------------------
-- 디자인 모델 시드
-- ----------------------------------------------------------------
INSERT INTO design_models (model_code, name, description, thumbnail_image, base_price, category, style_keywords)
VALUES
 ('A', '모던 미니멀',  '깔끔한 라인과 모노톤 컬러로 정돈된 모던 미니멀 스타일',  '/uploads/design/a.jpg',  8000000,  '거실', '모던,미니멀,화이트,블랙'),
 ('B', '내추럴 우드',  '원목과 그린 식물로 따뜻한 분위기를 만드는 내추럴 스타일', '/uploads/design/b.jpg',  9500000,  '거실', '내추럴,우드,베이지,따뜻함'),
 ('C', '클래식 럭셔리', '몰딩과 골드 포인트가 어우러진 클래식 럭셔리 인테리어',   '/uploads/design/c.jpg', 14000000, '거실', '클래식,럭셔리,골드,몰딩'),
 ('D', '인더스트리얼',  '노출 콘크리트와 메탈로 표현한 인더스트리얼 무드',         '/uploads/design/d.jpg', 11000000, '거실', '인더스트리얼,콘크리트,블랙,메탈')
ON DUPLICATE KEY UPDATE name = VALUES(name);

-- ----------------------------------------------------------------
-- 관리자 계정 (admin@24eum.com / test1234)
-- BCryptPasswordEncoder(strength=10) 로 인코딩된 해시
-- ※ 운영 환경에서는 부팅 후 반드시 비밀번호를 변경하세요.
-- ----------------------------------------------------------------
INSERT INTO users (email, password, nickname, role, provider)
VALUES ('admin@24eum.com',
        '$2a$10$08Ffx9rkcVO5qm42VJ0X6eauv7twFNytt/i8fgMk.JR1RaEKLxrxy',
        '관리자', 'ADMIN', 'LOCAL')
ON DUPLICATE KEY UPDATE nickname = VALUES(nickname);
