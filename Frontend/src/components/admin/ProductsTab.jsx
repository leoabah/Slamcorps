import DashboardCards from "./DashboardCards";
import ProductTable from "./ProductTable";
import SearchBar from "./SearchBar";

export default function ProductsTab({
    products,
    search,
    setSearch,
    totalProducts,
    totalStock,
    totalValue,
    handleDelete
}) {
    return (
        <div className="products-view">
            <DashboardCards
                view="productos"
                totalProducts={totalProducts}
                totalStock={totalStock}
                totalValue={totalValue}
            />

            <div className="products-section">
                <div className="products-top">
                    <h2>Productos</h2>
                    <SearchBar search={search} setSearch={setSearch} />
                </div>

                <ProductTable products={products} handleDelete={handleDelete} />
            </div>
        </div>
    );
}