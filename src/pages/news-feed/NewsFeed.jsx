import React, {useEffect, useState} from "react";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import MainLayout from "../../components/MainLayout";
import { getSource, updateProfile,getAuthor } from "../../services/index/users";
import ProfilePicture from "../../components/ProfilePicture";
import { userActions } from "../../store/reducers/userReducers";
import { toast } from "react-hot-toast";

const NewsFeed = () => {

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const queryClient = useQueryClient();
  const userState = useSelector((state) => state.user);
  const [dataSourceCheckboxItem, setDataSourceCheckboxItem] = useState([]);
  const [dataAuthorCheckboxItem, setdataAuthorCheckboxItem] = useState([]);
  const [dataCategoryCheckboxItem, setDataCategoryCheckboxItem] = useState([]);

  const {
    data: dataSource,
    isLoading: profileIsLoading,
    error: profileError,
  } = useQuery({
    queryFn: () => {
      return getSource({ token: userState.userInfo.token });
    },
    queryKey: ["news-feed"],
  });

  const { mutate, isLoading: updateProfileIsLoading } = useMutation({
    mutationFn: ({ name, email, password }) => {
      return updateProfile({
        token: userState.userInfo.token,
        userData: { name, email, password },
      });
    },
    onSuccess: (data) => {
      dispatch(userActions.setUserInfo(data));
      localStorage.setItem("account", JSON.stringify(data));
      queryClient.invalidateQueries(["profile"]);
      toast.success("Profile is updated");
    },
    onError: (error) => {
      toast.error(error.message);
      console.log(error);
    },
  });

  useEffect(() => {
    if (!userState.userInfo) {
      navigate("/");
    }
  }, [navigate, userState.userInfo]);

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm({
    mode: "onChange",
  });


  const submitHandler = (data) => {
        console.log(dataSourceCheckboxItem);
        console.log(dataAuthorCheckboxItem);
  };

  const handelDataSourceCheckbox = (item) => {
    const isChecked = dataSourceCheckboxItem.includes(item);
    if (isChecked) {
      // Item is already checked, remove it from the checkedItems array
      setDataSourceCheckboxItem(dataSourceCheckboxItem.filter((checkedItem) => checkedItem !== item));
    } else {
      // Item is not checked, add it to the checkedItems array
      setDataSourceCheckboxItem([...dataSourceCheckboxItem, item]);
    }
  };

  const handelDataAuthorCheckbox = (item) => {
    const isChecked = dataAuthorCheckboxItem.includes(item);
    if (isChecked) {
      // Item is already checked, remove it from the checkedItems array
      setdataAuthorCheckboxItem(dataAuthorCheckboxItem.filter((checkedItem) => checkedItem !== item));
    } else {
      // Item is not checked, add it to the checkedItems array
      setdataAuthorCheckboxItem([...dataAuthorCheckboxItem, item]);
    }
  };

  const handelDataCategoryCheckbox = (item) => {
    const isChecked = dataCategoryCheckboxItem.includes(item);
    if (isChecked) {
      // Item is already checked, remove it from the checkedItems array
      setDataCategoryCheckboxItem(dataCategoryCheckboxItem.filter((checkedItem) => checkedItem !== item));
    } else {
      // Item is not checked, add it to the checkedItems array
      setDataCategoryCheckboxItem([...dataCategoryCheckboxItem, item]);
    }
  };



  return (
      <MainLayout>
        <section className="container mx-auto px-5 py-10">
          <div className="w-full max-w-sm mx-auto">
            <form onSubmit={handleSubmit(submitHandler)}>
              <div className="flex flex-col mb-6 w-full">
                <h1>Select Data Source</h1>
                {dataSource && dataSource.source.map((item) => (
                    <div key={item} className="flex items-center space-x-4">
                      <input
                          type="checkbox"
                          id={`checkbox-${item}`}
                          className="text"
                          checked={dataSourceCheckboxItem.includes(item)}
                          onChange={() => handelDataSourceCheckbox(item)}
                      />
                      <label
                          htmlFor={`checkbox-${item}`}
                          className="flex items-center cursor-pointer"
                      >
                        <span className="ml-2 text-gray-700">{item}</span>
                      </label>
                    </div>
                ))}
              </div>

              <div className="flex flex-col mb-6 w-full">
                <h1>Select Author</h1>
                {dataSource && dataSource.author.map((item) => (
                    <div key={item} className="flex items-center space-x-4">
                      <input
                          type="checkbox"
                          id={`checkbox-${item}`}
                          className="text"
                          checked={dataAuthorCheckboxItem.includes(item)}
                          onChange={() => handelDataAuthorCheckbox(item)}
                      />
                      <label
                          htmlFor={`checkbox-${item}`}
                          className="flex items-center cursor-pointer"
                      >
                        <span className="ml-2 text-gray-700">{item}</span>
                      </label>
                    </div>
                ))}
              </div>

              <div className="flex flex-col mb-6 w-full">
                <h1>Select Category</h1>
                {dataSource && dataSource.category.map((item) => (
                    <div key={item} className="flex items-center space-x-4">
                      <input
                          type="checkbox"
                          id={`checkbox-${item}`}
                          className="text"
                          checked={dataCategoryCheckboxItem.includes(item)}
                          onChange={() => handelDataCategoryCheckbox(item)}
                      />
                      <label
                          htmlFor={`checkbox-${item}`}
                          className="flex items-center cursor-pointer"
                      >
                        <span className="ml-2 text-gray-700">{item}</span>
                      </label>
                    </div>
                ))}
              </div>


              <button
                  type="submit"
                  disabled={!isValid  || updateProfileIsLoading}
                  className="bg-primary text-white font-bold text-lg py-4 px-8 w-full rounded-lg mb-6 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                Update
              </button>
            </form>
          </div>
        </section>
      </MainLayout>
  );
};

export default NewsFeed;
