# **프로젝트 : 24이음 (24eum) - 인테리어 자재 & 업자 매칭 플랫폼** 🏠

> 인테리어 디자인 모델을 선택하고, 예산과 면적에 맞는 **시공업자를 자동 매칭**해주는 플랫폼
> 
> AI 검색(MCP)과 실시간 1:1 채팅으로 사용자와 시공업자를 연결

<br>

---

## 📋 목차
- [1. 프로젝트 개요](#1-프로젝트-개요)
- [2. 프로젝트 구조](#2-프로젝트-구조)
- [3. 팀 구성 및 역할](#3-팀-구성-및-역할)
- [4. 기술 스택](#4-기술-스택)
- [5. 프로젝트 수행 경과](#5-프로젝트-수행-경과)
- [6. 핵심 기능 코드 리뷰](#6-핵심-기능-코드-리뷰)
- [7. 화면 UI](#7-화면-ui)
- [8. 개발 환경 설정 가이드](#8-개발-환경-설정-가이드)
- [9. 자체 평가 의견](#9-자체-평가-의견)

---

<br>

## 1. 프로젝트 개요

### 1-1. 프로젝트 주제
- 인테리어 디자인 모델 선택 & 시공업자 매칭 플랫폼 **"24이음"**

### 1-2. 주제 선정 배경
- 인테리어 시공 시 업자 선정의 어려움 (가격 비교, 신뢰성 검증)
- 디자인 선택부터 시공업자 매칭까지 원스톱 서비스의 필요성
- 비대면 상담 수요 증가에 따른 실시간 채팅 기능 필요

### 1-3. 기획 의도
- 디자인 모델(A/B/C/D)을 선택하고 예산·면적을 입력하면 최적의 시공업자 Top 5를 자동 매칭
- AI 검색(MCP)을 통한 지능형 인테리어 정보 검색
- 1:1 실시간 채팅으로 사용자와 시공업자 간 직접 소통

### 1-4. 기대효과
- 인테리어 시공업자 선택의 투명성 및 편의성 향상
- AI 기반 맞춤형 검색으로 사용자 만족도 증대
- 찜/리뷰/평점 시스템으로 신뢰할 수 있는 업자 정보 제공

<br>

---

## 2. 프로젝트 구조

### 2-1. 주요 기능
| 구분 | 기능 |
|:---:|:---|
| 👤 사용자 | 회원가입 / 로그인 (JWT 토큰 인증) / 카카오 소셜 로그인 |
| 🎨 디자인 모델 | A/B/C/D 디자인 모델 선택 / 상세 조회 |
| 💰 견적 요청 | 예산 입력 / 면적(평수) 입력 / 견적 요청서 작성 |
| 🔧 업자 매칭 | DB 기반 시공업자 Top 5 자동 매칭 / 업자 상세 조회 |
| 💬 1:1 채팅 | WebSocket(STOMP + SockJS) 기반 실시간 채팅 (JSON) |
| 🤖 AI 검색 | MCP 기반 인테리어 관련 AI 검색 |
| ❤️ 찜 / 평점 | 시공업자 찜(좋아요) / 리뷰 평점 등록 |
| 👤 마이페이지 | 내 정보 수정 / 찜 목록 / 요청 내역 조회 |
| 🛡️ 관리자 | 회원 관리 / 업자 관리 / 리뷰 관리 / 대시보드 |

### 2-2. 메뉴 구조도
<details>
  <summary>메뉴 구조도 펼치기</summary>
  
  <!-- TODO: 메뉴 구조도 이미지 추가 -->
</details>

<br>

---

## 3. 팀 구성 및 역할

| 이름 | 역할 | 담당 업무 |
|:---:|:---:|:---|
| **최영우** | 팀장 | • 프로젝트 총괄 및 일정 관리<br>• AI 검색(MCP) 기능 구현<br>• 프로젝트 깃허브 관리 |
| **유지상** | 팀원 | • 로그인/회원가입 및 JWT 인증 구현<br>• 카카오 소셜 로그인 (OAuth 2.0)<br>• Spring Security 설정 |
| **김현수** | 팀원 | • 디자인 모델 선택 및 견적 요청 기능<br>• 프론트엔드 UI 구현 (React + Tailwind CSS)<br>• 반응형 레이아웃 설계 |
| **전휘강** | 팀원 | • 1:1 실시간 채팅 기능 구현 (WebSocket) <br>• DB 설계 및 관리 |
| **정성준** | 팀원 | • 찜/리뷰/평점 기능 구현<br>• 관리자 페이지 구현<br>• 시공업자 매칭 알고리즘 구현 |

> 💡 인원 : **5명** &nbsp;|&nbsp; 기간 : **2026.04 ~ 2026.XX**

<br>

---

## 4. 기술 스택

### Frontend
<div align="left">
  <img src="https://img.shields.io/badge/React_18-20232A?style=for-the-badge&logo=react&logoColor=61DAFB">
  <img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white">
  <img src="https://img.shields.io/badge/Vite_6-646CFF?style=for-the-badge&logo=vite&logoColor=white">
  <img src="https://img.shields.io/badge/Tailwind_CSS_4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white">
  <img src="https://img.shields.io/badge/Radix_UI-161618?style=for-the-badge&logo=radixui&logoColor=white">
  <img src="https://img.shields.io/badge/React_Router-CA4245?style=for-the-badge&logo=reactrouter&logoColor=white">
  <img src="https://img.shields.io/badge/Axios-5A29E4?style=for-the-badge&logo=axios&logoColor=white">
</div>

### Backend
<div align="left">
  <img src="https://img.shields.io/badge/Spring_Boot_3.5-6DB33F?style=for-the-badge&logo=springboot&logoColor=white">
  <img src="https://img.shields.io/badge/Spring_Security-6DB33F?style=for-the-badge&logo=springsecurity&logoColor=white">
  <img src="https://img.shields.io/badge/OAuth_2.0-EB5424?style=for-the-badge&logo=auth0&logoColor=white">
  <img src="https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white">
  <img src="https://img.shields.io/badge/MyBatis-000000?style=for-the-badge">
  <img src="https://img.shields.io/badge/Lombok-DC382D?style=for-the-badge">
  <img src="https://img.shields.io/badge/WebSocket-010101?style=for-the-badge">
</div>

### Database
<div align="left">
  <img src="https://img.shields.io/badge/MySQL-4479A1?style=for-the-badge&logo=mysql&logoColor=white">
</div>

### API / Service
<div align="left">
  <img src="https://img.shields.io/badge/OpenAI_API_(MCP)-412991?style=for-the-badge&logo=openai&logoColor=white">
  <img src="https://img.shields.io/badge/Kakao_Login-FEE500?style=for-the-badge&logo=kakao&logoColor=000000">
  <img src="https://img.shields.io/badge/STOMP_WebSocket-010101?style=for-the-badge">
</div>

### Tools
<div align="left">
  <img src="https://img.shields.io/badge/Git-F05032?style=for-the-badge&logo=git&logoColor=white">
  <img src="https://img.shields.io/badge/GitHub-181717?style=for-the-badge&logo=github&logoColor=white">
  <img src="https://img.shields.io/badge/VS_Code-007ACC?style=for-the-badge&logo=visual-studio-code&logoColor=white">
  <img src="https://img.shields.io/badge/Gradle-02303A?style=for-the-badge&logo=gradle&logoColor=white">
  <img src="https://img.shields.io/badge/npm-CB3837?style=for-the-badge&logo=npm&logoColor=white">
</div>

### Architecture
```
backend/                              ← Spring Boot 백엔드 (REST API)
├── src/main/java/com/aloha/_24eum/
│   ├── config/                       ← Security, WebSocket, MyBatis 설정
│   ├── controller/                   ← REST API 컨트롤러
│   ├── dao/                          ← MyBatis Mapper 인터페이스
│   ├── dto/                          ← 데이터 전송 객체
│   ├── security/                     ← JWT 인증 필터 & 토큰 유틸
│   │   └── oauth/                    ← OAuth2 소셜 로그인 (카카오)
│   └── service/                      ← 비즈니스 로직 (Interface + Impl)
├── src/main/resources/
│   ├── mybatis/mapper/               ← SQL 매퍼 XML
│   └── application.properties        ← JWT 시크릿, DB 설정
└── uploads/                          ← 업로드 파일 저장소

frontend/                            ← React 프론트엔드 (Vite + TypeScript)
├── src/
│   ├── api/                          ← Axios API 호출 모듈
│   ├── components/                   ← 공통 UI 컴포넌트
│   │   ├── header/                   ← 헤더
│   │   ├── footer/                   ← 푸터
│   │   ├── ui/                       ← 공통 UI (Button, Input)
│   │   ├── modal/                    ← 모달
│   │   └── common/                   ← 공용 컴포넌트 (Loading 등)
│   ├── contexts/                     ← AppContext (JWT 인증 상태 관리)
│   ├── pages/                        ← 페이지별 컴포넌트
│   │   ├── Home/                     ← 메인 홈
│   │   ├── login/                    ← 로그인
│   │   ├── signup/                   ← 회원가입
│   │   ├── design/                   ← 디자인 모델 (목록/상세)
│   │   ├── estimate/                 ← 견적 요청 (폼/결과)
│   │   ├── contractor/               ← 시공업자 (목록/상세)
│   │   ├── chat/                     ← 1:1 채팅 (목록/채팅방)
│   │   ├── ai/                       ← AI 검색
│   │   ├── mypage/                   ← 마이페이지
│   │   ├── favorites/                ← 찜 목록
│   │   ├── review/                   ← 리뷰 작성
│   │   ├── admin/                    ← 관리자 페이지
│   │   └── error/                    ← 에러 페이지
│   ├── layouts/                      ← 레이아웃 (Main, Admin)
│   ├── styles/                       ← 스타일 (Tailwind CSS)
│   ├── routes.tsx                    ← React Router 라우팅 설정
│   └── App.tsx                       ← 앱 진입점
├── package.json                      ← 의존성 관리
└── vite.config.ts                    ← Vite 빌드 설정 (프록시)
```

<br>

---

## 5. 프로젝트 수행 경과

### 5-1. 요구사항 & 기능 정의서
<details>
  <summary>요구사항 및 기능 정의서 펼치기</summary>
  
  <!-- TODO: 요구사항 및 기능 정의서 이미지 추가 -->
</details>

### 5-2. ERD
<details>
  <summary>ERD 펼치기</summary>
  
  <!-- TODO: ERD 이미지 추가 -->
</details>

<br>

---

## 6. 핵심 기능 코드 리뷰

### 6-1. JWT 인증 & 카카오 소셜 로그인
> Spring Security + JWT 토큰 기반 Stateless 인증 + 카카오 소셜 로그인

<details>
  <summary>코드 보기</summary>

```java
// TODO: JWT 인증 필터 코드 추가
```

```java
// TODO: 카카오 소셜 로그인 처리 코드 추가
```
</details>

### 6-2. 시공업자 매칭 알고리즘
> 예산, 면적, 디자인 모델 기반 Top 5 시공업자 자동 매칭

<details>
  <summary>코드 보기</summary>

```java
// TODO: 매칭 알고리즘 코드 추가
```
</details>

### 6-3. 1:1 실시간 채팅 (WebSocket)
> STOMP + SockJS 기반 실시간 채팅 (JSON 메시지 포맷)

<details>
  <summary>코드 보기</summary>

```java
// TODO: WebSocket 채팅 코드 추가
```

```tsx
// TODO: React 채팅 클라이언트 코드 추가
```
</details>

### 6-4. AI 검색 (MCP)
> OpenAI API 기반 MCP 인테리어 관련 AI 검색

<details>
  <summary>코드 보기</summary>

```java
// TODO: AI 검색 서비스 코드 추가
```
</details>

<br>

---

## 7. 화면 UI

### 7-1. 메인 페이지
<!-- TODO: 메인 페이지 스크린샷 추가 -->

### 7-2. 디자인 모델 선택
<!-- TODO: 디자인 모델 선택 스크린샷 추가 -->

### 7-3. 견적 요청 & 업자 매칭
<!-- TODO: 견적 요청 및 매칭 결과 스크린샷 추가 -->

### 7-4. 1:1 채팅
<!-- TODO: 채팅 화면 스크린샷 추가 -->

### 7-5. AI 검색
<!-- TODO: AI 검색 화면 스크린샷 추가 -->

### 7-6. 관리자 페이지
<!-- TODO: 관리자 페이지 스크린샷 추가 -->

<br>

---

## 8. 개발 환경 설정 가이드

### 8-1. 사전 요구사항
| 항목 | 버전 | 비고 |
|:---:|:---:|:---|
| **JDK** | 23 | [Oracle JDK 23](https://www.oracle.com/java/technologies/downloads/#jdk23) |
| **Node.js** | 20 이상 (LTS 권장) | [Node.js 다운로드](https://nodejs.org/) |
| **MySQL** | 8.x | 스키마명: `24eum`, 포트: `3306` |
| **VS Code** | 최신 | Java Extension Pack, ES7+ React 확장 설치 권장 |

### 8-2. 프로젝트 클론
```bash
git clone <레포지토리 URL>
cd 24eum
```

### 8-3. 백엔드 설정 (Spring Boot)
```bash
cd backend
```

1. **시크릿 파일 생성**  
   `src/main/resources/application-secret.properties` 파일을 생성하고, 아래 내용을 본인 환경에 맞게 작성:
   ```properties
   # 카카오 소셜 로그인
   KAKAO_CLIENT_ID=<카카오 REST API 키>
   KAKAO_CLIENT_SECRET=<카카오 Client Secret>
   KAKAO_REDIRECT_URI=http://localhost:8080/login/oauth2/code/kakao
   ```
   > ⚠️ 이 파일은 `.gitignore`에 포함되어 있으므로 **너네가 알아서 직접 생성**해야 함.

2. **MySQL 데이터베이스 생성**
   ```sql
   CREATE DATABASE `24eum` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
   ```

3. **백엔드 실행**
   ```bash
   # Windows
   .\gradlew.bat bootRun
   
   # Mac / Linux
   ./gradlew bootRun
   ```
   → `http://localhost:8080` 에서 백엔드 서버 실행 확인

### 8-4. 프론트엔드 설정 (React + Vite)
```bash
cd frontend
```

1. **의존성 설치**
   ```bash
   npm install
   ```

2. **개발 서버 실행**
   ```bash
   npm run dev
   ```
   → `http://localhost:5173` 에서 프론트엔드 개발 서버 실행 확인  
   → API 요청은 Vite 프록시를 통해 자동으로 `localhost:8080`으로 전달

### 8-5. 전체 실행 순서 요약
```
1. MySQL 실행 → 24eum DB 생성
2. backend/ → application-secret.properties 생성
3. backend/ → .\gradlew.bat bootRun
4. frontend/ → npm install → npm run dev
5. 브라우저에서 http://localhost:5173 접속
```

### 8-6. 주의사항
- `application-secret.properties`는 Git에 올라가지 않음 **최영우 < 한테 키 값 공유받아서 작성**
- `backend/build/`, `backend/.gradle/`, `frontend/node_modules/`는 Git에 포함되지 않으며, 각자 환경에서 자동 생성됨
- Java 23이 설치되어 있는지 확인: `java --version`
- Node.js가 설치되어 있는지 확인: `node --version`

<br>

---

## 9. 자체 평가 의견

### 잘한 점
- <!-- TODO: 잘한 점 작성 -->

### 아쉬운 점
- <!-- TODO: 아쉬운 점 작성 -->

### 개선할 점
- <!-- TODO: 개선할 점 작성 -->

<br>

---

> 📌 **24이음(24eum)** — 인테리어의 모든 과정을 이어주는 매칭 플랫폼
