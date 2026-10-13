package app.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class MarketResponse {

    private Long id;
    private String name;
    private String district;
    private String state;
    private Double latitude;
    private Double longitude;
    private String marketCode;
    private boolean active;
}