package com.aloha._24eum.controller;

/**
 * 견적 요청 & 업자 매칭 컨트롤러
 * - POST /api/estimates                    : 견적 요청 생성 (디자인모델 + 예산 + 평수)
 * - GET  /api/estimates/{id}               : 견적 요청 상세 조회
 * - GET  /api/estimates/{id}/matches       : 매칭 결과 조회 (추천 업자 5명)
 * - POST /api/estimates/{id}/select/{cid}  : 업자 선택 확정
 * - PUT  /api/estimates/{id}/status        : 상태 변경
 */
public class EstimateController {
}
