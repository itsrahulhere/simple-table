import "./TableUI.css";
import React, { useEffect, useState } from "react";
import { Table, Dropdown, DropdownButton } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import useForceUpdate from "use-force-update";
import {
  faArrowDown,
  faArrowUp,
  faEdit,
  faSort,
} from "@fortawesome/free-solid-svg-icons";

function TableUI() {
  const [categoryData, setCategoryData] = useState([]);
  const [changePrice, setChangePrice] = useState("");
  const [data, setData] = useState([]);
  const [isAsc, setIsAsc] = useState(false);
  const [isEditClicked, setIsEditClicked] = useState(false);
  const [isPriceSortClicked, setIsPriceSortClicked] = useState(false);
  const [originalData, setOriginalData] = useState([]);
  const [selectedIdPriceEdit, setSelectedIdPriceEdit] = useState("");

  const forceUpdate = useForceUpdate();

  const fetchTableData = () => {
    fetch("https://json-server-render-hiv1.onrender.com/data")
      .then((response) => {
        return response.json();
      })
      .then((result) => {
        setData(result);
        setOriginalData(result);

        //Adding distinct category in categoryData
        let allCategoryList = [];
        result.map((item) => {
          allCategoryList.push(item.category);
        });
        var uniqueCategory = new Set(allCategoryList);
        var uniqueCategoryArr = Array.from(uniqueCategory);
        setCategoryData(uniqueCategoryArr);
      });
  };

  const editPriceSubmit = (event, id, oldPrice) => {
    event.preventDefault();
    var data_1 = data.find((data_1) => data_1.id === id);
    if (changePrice != "") {
      data_1.price = changePrice;
    } else {
      data_1.price = oldPrice;
    }

    fetch(`https://json-server-render-hiv1.onrender.com/data/${id}`, {
      method: "PUT",
      body: JSON.stringify(data_1),
      headers: {
        "Content-type": "application/json; charset=UTF-8",
      },
    })
      .then((response) => response.json())
      .then(() => {
        console.log("Successfully, added!");
      });

    setChangePrice("");
    setIsEditClicked(false);
  };

  const showOriginalData = () => {
    let newData = originalData.sort((a, b) => a.id - b.id);
    setData(newData);
    setIsPriceSortClicked(false);
  };

  const showSelectedData = (prop) => {
    let selectedCategoryList = [];
    originalData.map((item) => {
      if (prop === item.category) {
        selectedCategoryList.push(item);
      }
    });
    setData(selectedCategoryList);
    setIsPriceSortClicked(false);
  };

  const ascOrderByPrice = () => {
    let newData = data.sort((a, b) => a.price.localeCompare(b.price));
    setData(newData);
    forceUpdate();
    setIsAsc(true);
    setIsPriceSortClicked(true);
  };

  const descOrderByPrice = () => {
    let newData = data.sort((a, b) => b.price.localeCompare(a.price));
    setData(newData);
    forceUpdate();
    setIsAsc(false);
    setIsPriceSortClicked(true);
  };

  const editPrice = (id) => {
    setSelectedIdPriceEdit(id);
    setIsEditClicked(true);
    forceUpdate();
  };

  const resetEditForm = () => {
    setSelectedIdPriceEdit("");
    setIsEditClicked(false);
  };

  useEffect(() => {
    fetchTableData();
  }, []);

  return (
    <Table responsive striped bordered hover>
      <thead>
        <tr>
          <th>Id</th>
          <th>Name</th>
          <th>Image</th>

          <DropdownButton id="dropdown-basic-button" title="Category" size="sm">
            <Dropdown.Item onClick={() => showOriginalData()}>
              All
            </Dropdown.Item>
            {categoryData.length > 0 && (
              <th>
                {categoryData.map((item) => (
                  <Dropdown.Item
                    key={item.id}
                    onClick={() => showSelectedData(item)}
                  >
                    {item}
                  </Dropdown.Item>
                ))}
              </th>
            )}
          </DropdownButton>

          <th>Label</th>
          <th>Description</th>
          <th>
            Price
            {isPriceSortClicked === false ? (
              <button className="sortBtn" onClick={() => ascOrderByPrice()}>
                <FontAwesomeIcon icon={faSort} />
              </button>
            ) : isAsc === false ? (
              <button className="sortBtn" onClick={() => ascOrderByPrice()}>
                <FontAwesomeIcon icon={faArrowUp} />
              </button>
            ) : (
              <button className="sortBtn" onClick={() => descOrderByPrice()}>
                <FontAwesomeIcon icon={faArrowDown} />
              </button>
            )}
          </th>
        </tr>
      </thead>

      {data.length > 0 ? (
        <tbody>
          {data.map((item) => (
            <tr key={item.id}>
              <td>{item.id}</td>
              <td>{item.name}</td>
              <td>
                <img
                  src={item.image}
                  alt={item.id + " image"}
                  width={150}
                  height={125}
                />
              </td>
              <td>{item.category}</td>
              <td>{item.label}</td>
              <td>{item.description}</td>
              <td>
                {isEditClicked === true && item.id === selectedIdPriceEdit ? (
                  <form
                    onSubmit={(e) => editPriceSubmit(e, item.id, item.price)}
                  >
                    <tr>
                      <input
                        type="text"
                        defaultValue={item.price}
                        className="priceElements"
                        onChange={(e) => setChangePrice(e.target.value)}
                      />
                      <br />
                      <input
                        type="submit"
                        className="priceElements"
                        value="Submit"
                      />
                      <br />
                      <input
                        type="button"
                        onClick={() => resetEditForm()}
                        value="Reset"
                      />
                    </tr>
                  </form>
                ) : (
                  <tr>
                    <td style={{ paddingRight: 5 }}>{item.price}</td>
                    <td>
                      <button
                        className="editBtn"
                        onClick={() => {
                          editPrice(item.id);
                        }}
                      >
                        <FontAwesomeIcon icon={faEdit} />
                      </button>
                    </td>
                  </tr>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      ) : (
        <tbody>
          <tr>
            <td colSpan={7}>No Items Available</td>
          </tr>
        </tbody>
      )}
    </Table>
  );
}

export default TableUI;
