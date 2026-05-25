package com.aloha._24eum.dao;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import com.aloha._24eum.dto.Contractor;
import com.aloha._24eum.dto.MatchingResult;

@Mapper
public interface MatchingMapper {
    int insert(MatchingResult result);
    int deleteByEstimate(@Param("estimateRequestId") Long estimateRequestId);
    List<MatchingResult> findByEstimate(@Param("estimateRequestId") Long estimateRequestId);

    /** 매칭 후보 추출: 차단 안 된 업자 중 선호형태에 매칭모델 포함하는 후보 */
    List<Contractor> findCandidates(@Param("designCode") String designCode,
                                    @Param("area") java.math.BigDecimal area);
}
