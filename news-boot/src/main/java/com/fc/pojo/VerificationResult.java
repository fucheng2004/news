package com.fc.pojo;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;

@Data
@Schema(description = "验证结果")
public class VerificationResult {

    @Schema(description = "可信度")
    private Double credibility;
    
    @Schema(description = "来源")
    private String source;
    
    @Schema(description = "摘要")
    private String summary;
    
    @Schema(description = "类别")
    private String category;
    
    @Schema(description = "状态")
    private String status;
    
    @Schema(description = "验证时间")
    private String verifiedAt;
} 