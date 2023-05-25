import axios from "axios";

export const getAllPosts = async ({ token }) => {
  try {
    if (token!='') {
      const config = {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      };
      const { data } = await axios.get("/api/personalizedArticle", config);
      return data.data;
    }else{
      const {data} = await axios.get("/api/articles");
      return data.data;
    }
  } catch (error) {
    if (error.response && error.response.data.message)
      throw new Error(error.response.data.message);
    throw new Error(error.message);
  }
};

export const getSinglePost = async ({ slug }) => {
  try {
    const { data } = await axios.get(`/api/posts/${slug}`);
    return data;
  } catch (error) {
    if (error.response && error.response.data.message)
      throw new Error(error.response.data.message);
    throw new Error(error.message);
  }
};
