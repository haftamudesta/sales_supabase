import { useActionState, useEffect, useState } from "react";
import supabase from "../supabase-client";

const initialState = {
  success: false,
  error: null,
};

async function addDeal(_, formData) {
  const name = formData.get("name");
  const value = Number(formData.get("value"));

  if (!name || !value) {
    return {
      success: false,
      error: "Name and value are required.",
    };
  }

  const { error } = await supabase.from("sales_deal").insert({
    name,
    value,
  });

  if (error) {
    return {
      success: false,
      error: error.message,
    };
  }

  return {
    success: true,
    error: null,
  };
}

export function Form({ deals }) {
  const [rows, setRows] = useState([]);

  const [state, formAction, pending] = useActionState(addDeal, initialState);

  useEffect(() => {
    setRows(deals);
  }, [deals]);

  const handleChange = (id, field, value) => {
    setRows((previous) =>
      previous.map((row) =>
        row.id === id
          ? {
              ...row,
              [field]: field === "value" ? Number(value) : value,
            }
          : row,
      ),
    );
  };

  const updateDeal = async (deal) => {
    const { error } = await supabase
      .from("sales_deal")
      .update({
        name: deal.name,
        value: deal.value,
      })
      .eq("id", deal.id);

    if (error) {
      console.error(error);
    }
  };

  return (
    <div style={{ marginTop: "2rem" }}>
      <h2>Deals</h2>

      <table border="1" cellPadding="8" style={{ borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th>Name</th>
            <th>Value</th>
            <th></th>
          </tr>
        </thead>

        <tbody>
          {rows.map((deal) => (
            <tr key={deal.id}>
              <td>
                <input
                  value={deal.name}
                  onChange={(e) =>
                    handleChange(deal.id, "name", e.target.value)
                  }
                />
              </td>

              <td>
                <input
                  type="number"
                  value={deal.value}
                  onChange={(e) =>
                    handleChange(deal.id, "value", e.target.value)
                  }
                />
              </td>

              <td>
                <button onClick={() => updateDeal(deal)}>Update</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <hr />

      <h2>Add Deal</h2>

      <form action={formAction}>
        <input name="name" placeholder="Deal name" />

        <input name="value" type="number" placeholder="Value" />

        <button type="submit" disabled={pending}>
          {pending ? "Adding..." : "Add Deal"}
        </button>
      </form>

      {state.error && <p style={{ color: "red" }}>{state.error}</p>}

      {state.success && (
        <p style={{ color: "green" }}>Deal added successfully.</p>
      )}
    </div>
  );
}
