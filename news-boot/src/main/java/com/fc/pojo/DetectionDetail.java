package com.fc.pojo;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

@Data
@Schema(description = "检测详情")
public class DetectionDetail {
    
    @Schema(description = "详情ID")
    private Long id;
    
    @Schema(description = "检测结果ID")
    private Long resultId;
    
    @Schema(description = "检测类型")
    private String type;
    
    @Schema(description = "检测分数")
    private Double score;
    
    @Schema(description = "检测说明")
    private String explanation;
} 