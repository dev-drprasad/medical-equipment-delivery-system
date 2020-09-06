package models

type Comment struct {
	ID        uint64  `json:"id" db:"id"`
	CreatedAt float64 `json:"createdAt" db:"createdAt"`
	UserID    uint64  `json:"userId" db:"userId"`
	OrderID   uint64  `json:"orderId" db:"orderId"`
	Content   string  `json:"content" db:"content"`

	Order *Order `json:"order" db:"-"`
	User  *User  `json:"user" db:"-"`
}
