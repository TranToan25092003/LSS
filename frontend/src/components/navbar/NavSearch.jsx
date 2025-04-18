import React from "react";
import { Input } from "../ui/input";

const NavSearch = () => {
  return (
    <Input
      type="search"
      placeholder="search supplies..."
      className="max-w-xs dark:bg-muted"
    ></Input>
  );
};

export default NavSearch;
