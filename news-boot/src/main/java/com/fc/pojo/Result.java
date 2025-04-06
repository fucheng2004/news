package com.fc.pojo;

import io.swagger.v3.oas.annotations.media.Schema;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Schema(description = "通用响应结果")
public class Result<T> {
    
    @Schema(description = "状态码")
    private Integer code;
    
    @Schema(description = "提示信息")
    private String message;
    
    @Schema(description = "返回数据")
    private T data;
    
    private static <E> Result<E> of(Integer code, String message, E data) {
        Result<E> result = new Result<E>();
        result.code = code;
        result.message = message;
        result.data = data;
        return result;
    }
    
    public static <E> Result<E> success() {
        Result<E> result = new Result<>();
        result.setCode(200);
        result.setMessage("操作成功");
        return result;
    }
    
    public static <E> Result<E> success(String message) {
        Result<E> result = new Result<>();
        result.setCode(200);
        result.setMessage(message);
        return result;
    }
    
    public static <E> Result<E> success(E data) {
        Result<E> result = new Result<>();
        result.setCode(200);
        result.setMessage("操作成功");
        result.setData(data);
        return result;
    }
    
    public static <E> Result<E> error(String message) {
        Result<E> result = new Result<>();
        result.setCode(500);
        result.setMessage(message);
        return result;
    }
    
    public static <E> Result<E> error(Integer code, String message) {
        return of(code, message, null);
    }
    
    @Override
    public String toString() {
        return "Result{" +
                "code=" + code +
                ", message='" + message + '\'' +
                ", data=" + data +
                '}';
    }
}
