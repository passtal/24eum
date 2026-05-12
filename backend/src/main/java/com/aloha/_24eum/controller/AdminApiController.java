package com.aloha._24eum.controller;

/**
 * 관리자 API 컨트롤러
 * - GET    /api/admin/users                  : 전체 유저 목록 (검색/필터)
 * - PUT    /api/admin/users/{id}/ban         : 유저 밴
 * - PUT    /api/admin/users/{id}/unban       : 유저 밴 해제
 * - GET    /api/admin/contractors            : 전체 업자 목록
 * - PUT    /api/admin/contractors/{id}/ban   : 업자 밴
 * - PUT    /api/admin/contractors/{id}/unban : 업자 밴 해제
 * - GET    /api/admin/reviews               : 전체 리뷰 목록
 * - PUT    /api/admin/reviews/{id}/hide     : 리뷰 숨김 처리
 * - PUT    /api/admin/reviews/{id}/show     : 리뷰 숨김 해제
 * - DELETE /api/admin/reviews/{id}          : 리뷰 삭제
 * - GET    /api/admin/dashboard             : 관리자 대시보드 통계
 */
public class AdminApiController {
}
