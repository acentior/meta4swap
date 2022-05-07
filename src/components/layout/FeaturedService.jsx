import React from "react";
import Headlines from "./Headlines";
import ItemCard from "./ItemCard";
import useWindowDimensions from "../hooks/useWindowDimensions";
function FeaturedService() {
  const { height, width } = useWindowDimensions();
  return (
    <>
      <Headlines text="Featured Services" content="Latest listed services" />

      <div
        className="container items-center mx-auto "
        style={{
          display: "flex",
          alignItems: "center",
          width: { width },
          justifyContent: "space-between",
        }}
      >
        <ItemCard />
        <ItemCard />
        <ItemCard />
        <ItemCard />
      </div>
    </>
  );
}

export default FeaturedService;