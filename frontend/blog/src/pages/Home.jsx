import React, { useEffect, useState } from "react";

function Home() {
  const [blogs, setBlogs] = useState([]);

  useEffect(() => {
  const fetchBlogs = async () => {
    try {
      const res = await fetch("http://localhost:3000/api/v1/blog/all");
      const data = await res.json();

      console.log("Frontend Response:", data); // 👈 IMPORTANT

      setBlogs(data.blogs || []);
    } catch (error) {
      console.log("Error fetching blogs:", error);
    }
  };

  fetchBlogs();
}, []);

  return (
    <div style={{ padding: "20px" }}>
      <h1>All Blogs</h1>

      {blogs.length === 0 && <p>No blogs found.</p>}

      {blogs.map((blog) => (
        <div
          key={blog._id}
          style={{
            border: "1px solid #ddd",
            margin: "15px 0",
            padding: "15px",
            borderRadius: "8px",
          }}
        >
          <h2>{blog.title}</h2>

          <p>
            {blog.description.length > 120
              ? blog.description.substring(0, 120) + "..."
              : blog.description}
          </p>

          <p><strong>Author:</strong> {blog.userId.username}</p>

          <p style={{ fontSize: "14px", opacity: 0.7 }}>
            {new Date(blog.createdAt).toLocaleDateString()}
          </p>
        </div>
      ))}
    </div>
  );
}

export default Home;
