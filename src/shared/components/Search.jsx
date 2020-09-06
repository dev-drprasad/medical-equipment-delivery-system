import React from "react";
import "./Search.scss";
import { useState } from "react";
import { Input, Button } from "antd";
import { SearchOutlined } from "@ant-design/icons";

export default function Search({ onSearch, size, ...rest }) {
  const [searchText, setSearchText] = useState("");
  const handleChange = (e) => {
    setSearchText(e.target.value);
  };

  const handleSubmit = () => onSearch(searchText);
  const handleClear = () => {
    setSearchText("");
    onSearch("");
  };
  return (
    <div className="search-container">
      <Input
        onChange={handleChange}
        value={searchText}
        onPressEnter={handleSubmit}
        addonAfter={
          <>
            <Button style={{ color: "rgba(0,0,0,0.65)" }} size={size} onClick={handleClear}>
              clear
            </Button>
            <Button icon={<SearchOutlined />} type="primary" size={size} onClick={handleSubmit} />
          </>
        }
        size={size}
        {...rest}
      />
    </div>
  );
}
