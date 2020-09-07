package models

import "gopkg.in/guregu/null.v3"

type Equipment struct {
	ID       *uint64     `json:"id" db:"id"`
	Name     null.String `json:"name" db:"name"`
	Code     null.String `json:"code" db:"code"`
	SetPrice *float64    `json:"setPrice" db:"setPrice"`

	// https://github.com/go-sql-driver/mysql/issues/34#issuecomment-248543900
}
