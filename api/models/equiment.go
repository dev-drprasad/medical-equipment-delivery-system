package models

type Equipment struct {
	ID       uint64  `json:"id" db:"id"`
	Name     string  `json:"name" db:"name"`
	Code     string  `json:"code" db:"code"`
	SetPrice float64 `json:"setPrice" db:"setPrice"`

	// https://github.com/go-sql-driver/mysql/issues/34#issuecomment-248543900
}
