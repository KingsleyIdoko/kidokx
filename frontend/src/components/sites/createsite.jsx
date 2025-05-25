import { useForm } from "react-hook-form";
import axios from "axios";
import { useSelector } from "react-redux";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function CreateSite() {
  const { sitedata } = useSelector((state) => state.site);
  const navigate = useNavigate();
  const formData = [
    { name: "Site Name", value: "" },
    { name: "Location", value: "" },
    { name: "Address", value: "" },
  ];

  const fieldMapping = {
    "Site Name": "site_name",
    Location: "location",
    Address: "description",
  };

  const {
    reset,
    handleSubmit,
    register,
    formState: { errors },
  } = useForm({ mode: "onChange" });

  useEffect(() => {
    if (sitedata && Object.keys(sitedata).length > 0) {
      const reverseMappedData = {
        "Site Name": sitedata.site_name || "",
        Location: sitedata.location || "",
        Address: sitedata.description || "",
      };
      reset(reverseMappedData);
    }
  }, [sitedata, reset]);

  const onSubmit = async (data) => {
    let response;
    const payload = {};
    Object.entries(data).forEach(([key, value]) => {
      payload[fieldMapping[key]] = value ? value.toLowerCase() : value;
    });

    try {
      if (sitedata && sitedata.id) {
        response = await axios.put(
          `http://127.0.0.1:8000/api/inventories/sites/${sitedata.id}/update/`,
          payload
        );
        console.log(response.status);
        if (response.status === 200) {
          navigate("/inventory/sites/list/");
        }
      } else {
        // Create new site (POST request)
        response = await axios.post(
          "http://127.0.0.1:8000/api/inventories/sites/create/",
          payload
        );
        if (response.status === 201) {
          navigate("/inventory/sites/list/");
        }
      }
      reset({});
    } catch (err) {
      console.error("API request failed:", err.message);
    }
  };

  return (
    <div className="max-w-[60rem] min-h-[40rem] bg-white rounded-lg mx-auto mt-12 p-10">
      <form onSubmit={handleSubmit(onSubmit)}>
        <h1 className="font-bold text-3xl text-center mb-12 uppercase">
          {sitedata?.id ? "Edit Site" : "Create Site"}
        </h1>

        <div className="space-y-8">
          {formData.map((formname, index) => (
            <div key={index} className="flex items-center justify-center gap-6">
              <label
                htmlFor={formname.name}
                className="w-[10rem] py-2 px-6 text-center font-medium bg-gray-100 border rounded-md"
              >
                {formname.name}
              </label>
              <div className="flex flex-col">
                <input
                  {...register(formname.name, {
                    required: `${formname.name} is required`,
                  })}
                  type="text"
                  id={formname.name}
                  className="w-[28rem] py-2 px-4 border rounded bg-gray-100 focus:outline-none focus:ring focus:border-gray-400"
                  placeholder={`Enter ${formname.name}`}
                />
                {errors[formname.name] && (
                  <span className="text-red-500 text-sm">
                    {errors[formname.name].message}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-end mt-10">
          <button
            type="submit"
            className="bg-sky-500 text-white px-10 py-3 rounded-md hover:opacity-80 transition"
          >
            {sitedata?.id ? "Update" : "Submit"}
          </button>
        </div>
      </form>
    </div>
  );
}
