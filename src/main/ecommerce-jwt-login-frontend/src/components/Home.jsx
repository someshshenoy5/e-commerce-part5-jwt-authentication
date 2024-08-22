import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import AppContext from "../Context/Context";

const Home = ({ selectedCategory }) => {
  const { addToCart} = useContext(AppContext);
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [isError, setIsError] = useState("");
  const [isDataFetched, setIsDataFetched] = useState(false);
  const token = localStorage.getItem("token");
  

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get("http://localhost:8080/api/products", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const productsWithImages = await Promise.all(
          response.data.map(async (product) => {
            try {
              const imageResponse = await axios.get(
                `http://localhost:8080/api/product/${product.id}/image`,
                {
                  responseType: "blob",
                  headers: {
                    Authorization: `Bearer ${token}`,
                  },
                }
              );
              const imageUrl = URL.createObjectURL(imageResponse.data);
              return { ...product, imageUrl };
            } catch (error) {
              console.error("Error fetching image:", error);
              return { ...product, imageUrl: "placeholder-image-url" };
            }
          })
        );
        setProducts(productsWithImages);
      } catch (error) {
        setIsError("Failed to fetch products. Please try again later.");
        console.error("Error fetching products:", error);
      }
    };

    if (!isDataFetched) {
      fetchProducts();
      setIsDataFetched(true);
    }
  }, [isDataFetched]);

  const filteredProducts = selectedCategory
    ? products.filter((product) => product.category === selectedCategory)
    : products;

  if (isError) {
    return (
      <h2 className="text-center" style={{ padding: "10rem" }}>
        Something went wrong...
      </h2>
    );
  }

  return (
    <>
           <div
             className="grid"
             style={{
               marginTop: "64px",
               display: "grid",
               gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
               gap: "20px",
               padding: "20px",
             }}
           >
             {filteredProducts.length === 0 ? (
               <h2
                 className="text-center"
                 style={{
                   display: "flex",
                   justifyContent: "center",
                   alignItems: "center",
                 }}
               >
                 No Products Available
               </h2>
             ) : (
               filteredProducts.map((product) => {
                 const { id, brand, name, price, productAvailable, imageUrl } =
                   product;
                 const cardStyle = {
                   width: "18rem",
                   height: "12rem",
                   boxShadow: "rgba(0, 0, 0, 0.24) 0px 2px 3px",
                   backgroundColor: productAvailable ? "#fff" : "#ccc",
                 };
                 return (
                   <div
                     className="card mb-3"
                     style={{
                       width: "250px",
                       height: "360px",
                       boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
                       borderRadius: "10px",
                       overflow: "hidden",
                       backgroundColor: productAvailable ? "#fff" : "#ccc",
                       display: "flex",
                       flexDirection: "column",
                       justifyContent:'flex-start',
                       alignItems:'stretch'
                     }}
                     key={id}
                   >
                     <Link
                       to={`/product/${id}`}
                       style={{ textDecoration: "none", color: "inherit" }}
                     >
                       <img
                         src={imageUrl}
                         alt={name}
                         style={{
                           width: "100%",
                           height: "150px",
                           objectFit: "cover",
                           padding: "5px",
                           margin: "0",
                           borderRadius: "10px 10px 10px 10px",
                         }}
                       />
                       <div
                         className="card-body"
                         style={{
                           flexGrow: 1,
                           display: "flex",
                           flexDirection: "column",
                           justifyContent: "space-between",
                           padding: "10px",
                         }}
                       >
                         <div>
                           <h5
                             className="card-title"
                             style={{ margin: "0 0 10px 0", fontSize: "1.2rem" }}
                           >
                             {name.toUpperCase()}
                           </h5>
                           <i
                             className="card-brand"
                             style={{ fontStyle: "italic", fontSize: "0.8rem" }}
                           >
                             {"~ " + brand}
                           </i>
                         </div>
                         <hr className="hr-line" style={{ margin: "10px 0" }} />
                         <div className="home-cart-price">
                           <h5
                             className="card-text"
                             style={{ fontWeight: "600", fontSize: "1.1rem",marginBottom:'5px' }}
                           >
                             <i className="bi bi-currency-rupee"></i>
                             {price}
                           </h5>
                         </div>
                         <button
                           className="btn-hover color-9"
                           style={{margin:'10px 25px 0px '  }}
                           onClick={(e) => {
                             e.preventDefault();
                             addToCart(product);
                           }}
                           disabled={!productAvailable}
                         >
                           {productAvailable ? "Add to Cart" : "Out of Stock"}
                         </button>
                       </div>
                     </Link>
                   </div>
                 );
               })
             )}
           </div>
         </>
  );
};

export default Home;
