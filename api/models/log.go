package models

type Log struct {
	ID       uint64                 `json:"id" db:"id"`
	CreatdAt uint64                 `json:"createdAt" db:"createdAt"`
	Message  string                 `json:"message" db:"message"`
	UserID   uint64                 `json:"userId" db:"userId"`
	Meta     map[string]interface{} `json:"meta" db:"meta"`
}
