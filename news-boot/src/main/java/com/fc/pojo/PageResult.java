package com.fc.pojo;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.Data;
import java.util.List;

@Data
@Schema(description = "分页结果")
public class PageResult<T> {
    
    @Schema(description = "总记录数")
    private Long total;
    
    @Schema(description = "当前页数据")
    private List<T> items;
    
    public PageResult(Long total, List<T> items) {
        this.total = total;
        this.items = items;
    }
} 