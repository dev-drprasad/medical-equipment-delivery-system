package models

import (
	null "gopkg.in/guregu/null.v3"
)

type Patient struct {
	AccountID   uint    `json:"accountId" db:"accountId"`
	CreatedAt   float64 `json:"createdAt" db:"createdAt"`
	FirstName   string  `json:"firstName" db:"firstName"`
	LastName    string  `json:"lastName" db:"lastName"`
	PhoneNumber string  `json:"phoneNumber" db:"phoneNumber"`

	// https://github.com/go-sql-driver/mysql/issues/34#issuecomment-248543900
	Address   null.String `json:"address" db:"address"`
	Zipcode   null.String `json:"zipcode" db:"zipcode"`
	BirthDate null.String `json:"birthDate" db:"birthDate"`

	InsuredByID *uint64  `json:"insuredById" db:"insuredBy"`
	InsuredBy   *Insurer `json:"insuredBy,omitempty"`
	Orders      []*Order `json:"orders" db:"-"`
}
