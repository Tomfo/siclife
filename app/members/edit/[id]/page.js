"use client";

import { getMemberbyId, updateMember } from "@/helpers/api-request";
import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { memberSchema, memberDefaultValues } from "@/lib/formValidationSchemas";
import { useForm, useFieldArray, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import axios from "axios";
import Snackbar from "@mui/material/Snackbar";
import Alert from "@mui/material/Alert";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
//import { IconButton } from '@mui/material';
import DeleteIcon from "@mui/icons-material/Delete";
import IconButton from "@mui/material/IconButton";
import EscalatorWarningIcon from "@mui/icons-material/EscalatorWarning";
import FamilyRestroomIcon from "@mui/icons-material/FamilyRestroom";
import AddIcon from "@mui/icons-material/Add";
import {
  faPenToSquare,
  faRemove,
  faChild,
  faMale,
  faUserPlus,
} from "@fortawesome/free-solid-svg-icons";
import { Button, CircularProgress, Box } from "@mui/material";
import Checkbox from "@mui/material/Checkbox";
import FormControlLabel from "@mui/material/FormControlLabel";
import Typography from "@mui/material/Typography";
import { useUserStore } from "@/app/store/userStore";

export default function EditMemberPage() {
  const queryClient = useQueryClient();
  const params = useParams();
  //const { id } = params;
  const { id } = useUserStore((state) => state.user);
  const router = useRouter();
  const [open, setOpen] = useState(false);
  // const [person, setPerson] = useState(null)

  const MAX_DEPENDANTS = 4;
  const MAX_PARENTS = 2;

  const { data, isLoading, error } = useQuery({
    queryKey: ["getmemberbyId", id],
    queryFn: () => getMemberbyId(id),
    enabled: !!id, // only run if id is truthy
  });

  const formatData = (member) => {
    if (!member) return {};

    return {
      nationalId: data.nationalId,
      idType: data.idType,
      firstName: data.firstName,
      middleName: data.middleName,
      lastName: data.lastName,
      gender: data.gender,
      birthday: data.birthday.split("T")[0],
      spouseFullname: data.spouseFullname,
      spousebirthday: data.spousebirthday.split("T")[0],
      email: data.email,
      telephone: data.telephone,
      residence: data.residence,
      underlying: data.underlying,
      condition: data.condition,
      declaration: data.declaration,
      children: data.children.map((child) => ({
        id: child.id,
        fullName: child.fullName,
        birthday: child.birthday.split("T")[0],
      })),
      parents: data.parents.map((parent) => ({
        id: parent.id,
        fullName: parent.fullName,
        birthday: parent.birthday.split("T")[0],
        relationship: parent.relationship,
      })),
    };
  };

  console.log(`editing...${id}`, data);

  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: memberDefaultValues,
    resolver: yupResolver(memberSchema),
  });
  //Add Field Array
  const {
    fields: childFields,
    append: appendChild,
    remove: removeChild,
  } = useFieldArray({
    control,
    name: "children",
  });

  const {
    fields: parentFields,
    append: appendParent,
    remove: removeParent,
  } = useFieldArray({
    control,
    name: "parents",
  });

  // Update form values when userData is available
  useEffect(() => {
    if (data) {
      reset(formatData(data));
    }
  }, [data, reset]);

  // Mutation for updating user
  const updateUserMutation = useMutation({
    mutationFn: (updatedMember) =>
      fetch(`${process.env.NEXT_PUBLIC_FRONTEND_API_URL}/api/members/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedMember),
      }),
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries(["getmemberbyId", id]);
      setOpen(true);
    },
  });

  const onSubmit = (formData) => {
    updateUserMutation.mutate(formData);
  };

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpen(false);
    router.push("/members");
  };

  if (isLoading) {
    return (
      <Box display="flex" justifyContent="center" mt={4}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box mt={4} textAlign="center">
        <Alert severity="error" sx={{ mb: 2 }}>
          {error.message}
        </Alert>
      </Box>
    );
  }

  return (
    <form className="m-5 bg-white p-2" onSubmit={handleSubmit(onSubmit)}>
      <div className="space-y-2">
        <div className="text-center">
          <h1 className=" text-[#283131] font-bold justify-center text-2xl">
            Insurance Policy Registration Update
          </h1>
        </div>
        <Snackbar
          open={open}
          autoHideDuration={2000}
          onClose={handleClose}
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
        >
          <Alert
            onClose={handleClose}
            severity="success"
            variant="filled"
            sx={{ width: "100%" }}
          >
            Record updated successfully 🙂
          </Alert>
        </Snackbar>
        <div className="border-b border-gray-500/10 pb-2">
          <h2 className="text-base/7 text-[#00ACAC] font-bold">
            Identification Details
          </h2>
          <div className="mt-2 grid grid-cols-1 gap-x-3 gap-y-2 sm:grid-cols-6">
            <div className="sm:col-span-2">
              <label
                htmlFor="nationalId"
                className="block text-sm/6 font-medium text-gray-500"
              >
                National Id
              </label>
              <div className="mt-2">
                <input
                  {...register("nationalId")}
                  type="text"
                  placeholder="National Id"
                  id="nationalId"
                  name="nationalId"
                  className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-500 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                />
                <p className="text-red-500 text-xs italic">
                  {errors.nationalId?.message}
                </p>
              </div>
            </div>

            <div className="sm:col-span-2">
              <label
                htmlFor="idType"
                className="block text-sm/6 font-medium text-gray-500"
              >
                Type of Identification
              </label>
              <div className="mt-2">
                <select
                  {...register("idType")}
                  className="block appearance-none w-full bg-white border border-gray-400 hover:border-gray-500 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline"
                  name="idType"
                  id="idType"
                >
                  <option value="GhCard">Ghana Card</option>
                  <option value="Passport">Passport</option>
                </select>
              </div>
            </div>
          </div>
        </div>
        <div className="border-b border-gray-500/10 pb-2">
          <section>
            <h2 className="text-base/7 font-bold text-[#00ACAC]">
              Personal Details
            </h2>
            <div className="mt-2 grid grid-cols-1 gap-x-3 gap-y-2 sm:grid-cols-6">
              <div className="sm:col-span-2">
                <label
                  htmlFor="firstName"
                  className="block text-sm/6 font-medium text-gray-500"
                >
                  First Name
                </label>
                <div className="mt-2">
                  <input
                    {...register("firstName")}
                    type="text"
                    placeholder="First Name"
                    id="firstName"
                    name="firstName"
                    className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-500 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                  />
                  <p className="text-red-500 text-xs italic">
                    {errors.firstName?.message}
                  </p>
                </div>
              </div>

              <div className="sm:col-span-2">
                <label
                  htmlFor="middleName"
                  className="block text-sm/6 font-medium text-gray-500"
                >
                  Middle Name
                </label>
                <div className="mt-2">
                  <input
                    {...register("middleName")}
                    type="text"
                    placeholder="Middle Name"
                    id="middleName"
                    name="middleName"
                    className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-500 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                  />
                  <p className="text-red-500 text-xs italic">
                    {errors.middleName?.message}
                  </p>
                </div>
              </div>
              <div className="sm:col-span-2">
                <label
                  htmlFor="lastName"
                  className="block text-sm/6 font-medium text-gray-500"
                >
                  Last Name
                </label>
                <div className="mt-2">
                  <input
                    {...register("lastName")}
                    type="text"
                    placeholder="last Name"
                    id="lastName"
                    name="lastName"
                    className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-500 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                  />
                  <p className="text-red-500 text-xs italic">
                    {errors.lastName?.message}
                  </p>
                </div>
              </div>
              <div className="sm:col-span-2">
                <label
                  htmlFor="birthday"
                  className="block text-sm/6 font-medium text-gray-500"
                >
                  Birthday (mm-dd-yyyy)
                </label>
                <div className="mt-2">
                  <input
                    {...register("birthday")}
                    type="date"
                    id="birthday"
                    name="birthday"
                    className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-500 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                  />
                  <p className="text-red-500 text-xs italic">
                    {errors.birthday?.message}
                  </p>
                </div>
              </div>
              <div className="sm:col-span-2">
                <label
                  htmlFor="gender"
                  className="block text-sm/6 font-medium text-gray-500"
                >
                  Gender
                </label>
                <div className="mt-2">
                  <select
                    {...register("gender")}
                    className="block appearance-none w-full bg-white border border-gray-400 hover:border-gray-500 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline"
                    name="gender"
                    id="gender"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                  <p className="text-red-500 text-xs italic">
                    {errors.gender?.message}
                  </p>
                </div>
              </div>
            </div>
          </section>
        </div>
        <div className="border-b border-gray-500/10 pb-2">
          <section>
            <h2 className="text-base/7 font-bold text-[#00ACAC]">
              Contact Details
            </h2>
            <div className="mt-2 grid grid-cols-1 gap-x-3 gap-y-2 sm:grid-cols-6">
              <div className="sm:col-span-2">
                <label
                  htmlFor="email"
                  className="block text-sm/6 font-medium text-gray-500"
                >
                  Email
                </label>
                <div className="mt-2">
                  <input
                    {...register("email")}
                    type="text"
                    placeholder="Email "
                    id="email"
                    name="email"
                    className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-500 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                  />
                  <p className="text-red-500 text-xs italic">
                    {errors.email?.message}
                  </p>
                </div>
              </div>

              <div className="sm:col-span-2">
                <label
                  htmlFor="telephone"
                  className="block text-sm/6 font-medium text-gray-500"
                >
                  Telephone
                </label>
                <div className="mt-2">
                  <input
                    {...register("telephone")}
                    type="text"
                    placeholder="Telephone"
                    id="telephone"
                    name="telephone"
                    className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-500 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                  />
                  <p className="text-red-500 text-xs italic">
                    {errors.telephone?.message}
                  </p>
                </div>
              </div>

              <div className="sm:col-span-2">
                <label
                  htmlFor="residence"
                  className="block text-sm/6 font-medium text-gray-500"
                >
                  Address
                </label>
                <div className="mt-2">
                  <input
                    {...register("residence")}
                    type="text"
                    placeholder="Address"
                    id="residence"
                    name="residence"
                    className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-500 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                  />
                  <p className="text-red-500 text-xs italic">
                    {errors.residence?.message}
                  </p>
                </div>
              </div>
            </div>
          </section>
        </div>
        <div className="border-b border-gray-500/10 pb-2">
          <section>
            <h2 className="text-base/7 font-bold text-[#00ACAC]">
              Spouse Details
            </h2>
            <div className="mt-4 grid grid-cols-1 gap-x-3 gap-y-2 sm:grid-cols-6">
              <div className="sm:col-span-2">
                <label
                  htmlFor="spouseFullname"
                  className="block text-sm/6 font-medium text-gray-500"
                >
                  Spouse Full Name
                </label>
                <div className="mt-2">
                  <input
                    {...register("spouseFullname")}
                    type="text"
                    placeholder="spouseFullname "
                    id="spouseFullname"
                    name="spouseFullname"
                    className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-500 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                  />
                  <p className="text-red-500 text-xs italic">
                    {errors.spouseFullname?.message}
                  </p>
                </div>
              </div>

              <div className="sm:col-span-2">
                <label
                  htmlFor="spousebirthday"
                  className="block text-sm/6 font-medium text-gray-500"
                >
                  Spouse Birthday (mm-dd-yyyy)
                </label>
                <div className="mt-2">
                  <input
                    {...register("spousebirthday")}
                    type="date"
                    placeholder="spousebirthday"
                    id="spousebirthday"
                    name="spousebirthday"
                    className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-500 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                  />
                  <p className="text-red-500 text-xs italic">
                    {errors.spousebirthday?.message}
                  </p>
                </div>
              </div>
            </div>
          </section>
        </div>
        <div className="border-b border-gray-500/10 pb-2">
          <section>
            <h2 className="text-base/7 font-bold text-[#00ACAC]">
              Children Details
            </h2>

            {childFields.map((field, index) => (
              <div
                key={field.id}
                className="mt-4 grid grid-cols-1 gap-x-3 gap-y-2 sm:grid-cols-6"
              >
                <input
                  type="hidden"
                  {...register(`children.${index}.id`)}
                  // value={field.id || ''}
                />
                <div className="sm:col-span-2">
                  <label
                    htmlFor={`children.${index}.fullName`}
                    className="block text-sm/6 font-medium text-gray-500"
                  >
                    Full Name:
                  </label>

                  <div className="mt-2">
                    <input
                      {...register(`children.${index}.fullName`)}
                      type="text"
                      placeholder={`child-[${index + 1}] fullname`}
                      id={`children.${index}.fullName`}
                      name={`children.${index}.fullName`}
                      className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-500 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                    />
                    <p className="text-red-500 text-xs italic">
                      {errors.children?.[index]?.fullName && (
                        <span>fullname is required</span>
                      )}
                    </p>
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <label
                    htmlFor={`children.${index}.birthday`}
                    className="block text-sm/6 font-medium text-gray-500"
                  >
                    Birthday (mm-dd-yyyy):
                  </label>

                  <div className="mt-2">
                    <input
                      {...register(`children.${index}.birthday`)}
                      type="date"
                      id={`children.${index}.birthday`}
                      name={`children.${index}.birthday`}
                      className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-500 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                    />
                    <p className="text-red-500 text-xs italic">
                      {errors.children?.[index]?.birthday && (
                        <span>birthday is required</span>
                      )}
                    </p>
                  </div>
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-sm/6 font-medium text-gray-500">
                    &nbsp;
                  </label>

                  <div className="mt-2">
                    <IconButton
                      color="error"
                      size="large"
                      onClick={() => removeChild(index)}
                      aria-label="error-button"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </div>
                </div>
              </div>
            ))}
            <Button
              onClick={() => appendChild({ fullName: "", birthday: "" })}
              variant="contained"
              color="primary"
              type="button"
              disabled={childFields.length >= MAX_DEPENDANTS}
            >
              <EscalatorWarningIcon />
              Add Child
            </Button>
          </section>
        </div>
        <div className="border-b border-gray-500/10 pb-2">
          <section>
            <h2 className="text-base/7 font-bold text-[#00ACAC]">
              Parent Details
            </h2>

            {parentFields.map((field, index) => (
              <div
                key={field.id}
                className="mt-4 grid grid-cols-1 gap-x-3 gap-y-2 sm:grid-cols-6"
              >
                <input
                  type="hidden"
                  {...register(`parents.${index}.id`)}
                  //value={field.id || ''}
                />
                <div className="sm:col-span-2">
                  <label
                    htmlFor={`parents.${index}.fullName`}
                    className="block text-sm/6 font-medium text-gray-500"
                  >
                    Full Name:
                  </label>

                  <div className="mt-2">
                    <input
                      {...register(`parents.${index}.fullName`)}
                      type="text"
                      placeholder={`parent-[${index + 1}] fullname`}
                      id={`parents.${index}.fullName`}
                      name={`parents.${index}.fullName`}
                      className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-500 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                    />
                    <p className="text-red-500 text-xs italic">
                      {errors.parents?.[index]?.fullName && (
                        <span>fullname is required</span>
                      )}
                    </p>
                  </div>
                </div>

                <div className="sm:col-span-1">
                  <label
                    htmlFor={`parents.${index}.birthday`}
                    className="block text-sm/6 font-medium text-gray-500"
                  >
                    Birthday (mm-dd-yyyy):
                  </label>

                  <div className="mt-2">
                    <input
                      {...register(`parents.${index}.birthday`)}
                      type="date"
                      id={`parents.${index}.birthday`}
                      name={`parents.${index}.birthday`}
                      className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-500 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                    />
                    <p className="text-red-500 text-xs italic">
                      {errors.parents?.[index]?.birthday && (
                        <span>birthday is required</span>
                      )}
                    </p>
                  </div>
                </div>
                <div className="sm:col-span-1">
                  <label
                    htmlFor={`parents.${index}.relationship`}
                    className="block text-sm/6 font-medium text-gray-500"
                  >
                    Relation:
                  </label>
                  <div className="mt-2">
                    <select
                      {...register(`parents.${index}.relationship`)}
                      name={`parents.${index}.relationship`}
                      id={`parents.${index}.relationship`}
                      className="block appearance-none w-full bg-white border border-gray-400 hover:border-gray-500 px-4 py-2 pr-8 rounded shadow leading-tight focus:outline-none focus:shadow-outline"
                    >
                      <option value="Father">Father</option>
                      <option value="Mother">Mother</option>
                      <option value="Inlaw">In-law</option>
                    </select>
                    <p className="text-red-500 text-xs italic">
                      {errors.parents?.[index]?.relationship && (
                        <span>relation is required</span>
                      )}
                    </p>
                  </div>
                </div>
                <div className="sm:col-span-1">
                  <label className="block text-sm/6 font-medium text-gray-500">
                    &nbsp;
                  </label>

                  <div className="mt-2">
                    <IconButton
                      color="error"
                      size="large"
                      onClick={() => removeParent(index)}
                      aria-label="error-button"
                    >
                      <DeleteIcon />
                    </IconButton>
                  </div>
                </div>
              </div>
            ))}

            <Button
              variant="contained"
              color="secondary"
              type="button"
              disabled={parentFields.length >= MAX_PARENTS}
              onClick={() =>
                appendParent({ fullName: "", birthday: "", relationship: "" })
              }
            >
              <FamilyRestroomIcon />
              Add Parent
            </Button>
          </section>
        </div>
        <div className="border-b border-gray-500/10 pb-2">
          <section>
            <h2 className="text-base/7 font-bold text-[#00ACAC]">
              Undertaking
            </h2>
            <div className="mt-4 grid grid-cols-1 gap-x-3 gap-y-2 sm:grid-cols-6">
              <div className="sm:col-span-4">
                <FormControlLabel
                  control={
                    <Controller
                      name="underlying"
                      control={control}
                      render={({ field }) => (
                        <Checkbox
                          {...field}
                          checked={field.value}
                          sx={{
                            color: "#ff5722",
                            "&.Mui-checked": {
                              color: "#ff5722",
                            },
                          }}
                        />
                      )}
                    />
                  }
                  label={
                    <Typography
                      variant="subtitle2"
                      sx={{ fontStyle: "italic" }}
                    >
                      Do you or your relatives listed have any ongoing illness
                      or condition?
                    </Typography>
                  }
                />
              </div>
              <div className="sm:col-span-4">
                <label
                  htmlFor="condition"
                  className="block text-sm/6 font-medium text-gray-500"
                >
                  Known Health Conditions
                </label>
                <div className="mt-2">
                  <textarea
                    {...register("condition")}
                    rows="2"
                    placeholder="conditions "
                    id="condition"
                    name="condition"
                    className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-500 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                  />
                  <p className="text-red-500 text-xs italic">
                    {errors.condition?.message}
                  </p>
                </div>
              </div>
              <div className="sm:col-span-3">
                <FormControlLabel
                  control={
                    <Controller
                      name="declaration"
                      control={control}
                      render={({ field }) => (
                        <Checkbox
                          {...field}
                          checked={field.value}
                          sx={{
                            color: "#ff5722",
                            "&.Mui-checked": {
                              color: "#ff5722",
                            },
                          }}
                        />
                      )}
                    />
                  }
                  label={
                    <Typography
                      variant="subtitle2"
                      sx={{ fontStyle: "italic" }}
                    >
                      I declare that the information provided is true, accurate
                      and complete to the best of my belief and knowledge
                    </Typography>
                  }
                />
                {/* <label
														htmlFor='declaration'
														className='block text-sm/6 font-medium text-gray-500'
												>
														<input
																className='mr-2 leading-tight'
																type='checkbox'
																name='declaration'
																id='declaration'
																{...register('declaration')}
														/>
														I declare that the information given if accurate
												</label> */}
              </div>
            </div>
          </section>
        </div>
      </div>
      <div className="mt-6 flex items-center justify-end gap-x-6">
        {/* <button type='button' className='text-sm/6 font-semibold text-gray-500'>
								Cancel
						</button> */}
        <Button variant="outlined" color="error" onClick={() => reset()}>
          Cancel
        </Button>
        <Button
          variant="contained"
          disabled={updateUserMutation.isLoading}
          type="submit"
          className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >
          {updateUserMutation.isPending ? "Saving..." : "Save"}
        </Button>
      </div>
    </form>
  );
}
