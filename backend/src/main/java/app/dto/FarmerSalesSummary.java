
package app.dto;

import java.math.BigDecimal;

public class FarmerSalesSummary {

    private long totalOrders;
    private long pendingOrders;
    private long completedOrders;

    private BigDecimal totalQuantitySold = BigDecimal.ZERO;
    private BigDecimal totalRevenue = BigDecimal.ZERO;

    public FarmerSalesSummary() {
    }

    public long getTotalOrders() {
        return totalOrders;
    }

    public void setTotalOrders(long totalOrders) {
        this.totalOrders = totalOrders;
    }

    public long getPendingOrders() {
        return pendingOrders;
    }

    public void setPendingOrders(long pendingOrders) {
        this.pendingOrders = pendingOrders;
    }

    public long getCompletedOrders() {
        return completedOrders;
    }

    public void setCompletedOrders(long completedOrders) {
        this.completedOrders = completedOrders;
    }

    public BigDecimal getTotalQuantitySold() {
        return totalQuantitySold;
    }

    public void setTotalQuantitySold(BigDecimal totalQuantitySold) {
        this.totalQuantitySold = totalQuantitySold;
    }

    public BigDecimal getTotalRevenue() {
        return totalRevenue;
    }

    public void setTotalRevenue(BigDecimal totalRevenue) {
        this.totalRevenue = totalRevenue;
    }
}
