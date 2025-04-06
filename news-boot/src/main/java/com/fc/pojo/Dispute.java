package com.fc.pojo;

import lombok.Data;

import java.util.List;

@Data
public class Dispute {
    private String resultId;
    private String type;
    private String description;
    private List<String> evidence;
}
