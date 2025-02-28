"use client";

import { getManager } from "@/helper/fetchApi";
import { User } from "@/types/type";
import { useEffect, useState } from "react";
import { DataTable } from "./UserDataTable";
import AddManagerForm from "./AddManagerForm";
import { ColumnDef } from "@tanstack/react-table";
import React from "react";
import AddUserForm from "./AddUserForm";

const userColumns: ColumnDef<User>[] = [
  {
    accessorKey: "id",
    header: "Id",
  },
  {
    accessorKey: "username",
    header: "Tài khoản",
  },
  {
    accessorKey: "name",
    header: "Tên",
  },
  {
    accessorKey: "gender",
    header: "Giới tính",
  },
  {
    accessorKey: "birthDate",
    header: "Ngày sinh",
    cell: ({ row }) => {
      const birthDate = row.original.birthDate;
      if (!birthDate) return "";

      const date = new Date(birthDate);
      const day = String(date.getDate()).padStart(2, "0");
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const year = date.getFullYear();

      return `${day}/${month}/${year}`;
    },
  },
  {
    accessorKey: "email",
    header: "Email",
  },
  {
    accessorKey: "accountType",
    header: "Loại tài khoản",
  },
];

const UserListTable = ({ role }: { role: string }) => {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const fetchManagers = async (param: string) => {
    setIsLoading(true);
    try {
      const res = await getManager(param);
      setUsers(res);
    } catch (error) {
      console.error("Error fetching users:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchManagers(role);
  }, [role]);

  return (
    <div className="py-10">
      <div className="my-5">
        {role !== "User" && (
          <AddManagerForm role={role} onSuccess={() => fetchManagers(role)} />
        )}
        {role === "User" && (
          <AddUserForm role={role} onSuccess={() => fetchManagers(role)} />
        )}
      </div>

      {isLoading && <div>Loading...</div>}
      {!isLoading && (
        <DataTable
          fetchData={() => fetchManagers(role)}
          columns={userColumns}
          data={users}
        />
      )}
    </div>
  );
};

export default UserListTable;
