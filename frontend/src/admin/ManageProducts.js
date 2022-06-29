import React, {useState, useEffect} from "react";
import Layout from "../core/Layout";
import {isAuthenticated} from "../auth";
import {Link} from "react-router-dom";
import Search from "../core/Search";
import Card from "../core/Card";
import {getProducts, deleteProduct} from "./apiAdmin";

const ManageProducts = () => {
    const [prodcuts, setProducts] = useState([])

    const {user, token} = isAuthenticated()

    const loadProducts = () => {
        getProducts().then(data => {
            if(data.error){
                console.log(data.error)
            }else{
                setProducts(data)
            }
        })
    }

    const destroy = productId => {
        deleteProduct(productId, user._id, token)
            .then(data => {
                if(data.error){
                    console.log(data.error)
                }else{
                    loadProducts();
                }
            })
    }

    useEffect(() => {
        loadProducts();
    }, [])

    return (
        <Layout title="Manage Products" description="Perform CRUD on products" className="container-fluid">
            <Search/>
            <h2 className="mb-4">Manage Products</h2>

            <div className="row">
                <div className="col-12">
                    <h2 className="text-center">Total {prodcuts.length} Products</h2>
                    <hr/>
                    <ul className="list-group">
                        {prodcuts.map((p, i) => (
                            <li key={i} className="list-group-item d-flex justify-content-between align-items-center">
                                <strong>{p.name}</strong>
                                <Link to={`/admin/product/update/${p._id}`}>
                                    <span className="badge badge-warning badge-pill">
                                        Update
                                    </span>
                                    <span onClick={() => destroy(p._id)} className="badge badge-danger badge-pill">
                                        Delete
                                    </span>
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </Layout>
    );
}

export default ManageProducts

