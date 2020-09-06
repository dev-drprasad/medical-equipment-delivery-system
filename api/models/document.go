package models

type Document struct {
	ID        uint64  `json:"id" db:"id"`
	CreatedAt float64 `json:"createdAt" db:"createdAt"`
	CreatedBy uint64  `json:"createdBy" db:"createdBy"`
	Name      string  `json:"name" db:"name"`
	Path      string  `json:"path" db:"path"`
	OrderID   uint64  `json:"orderId" db:"orderId"`
}
