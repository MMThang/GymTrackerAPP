"use client";
import { useFieldArray } from "react-hook-form";
import { Icons } from "../../../../../../components/icons";

export default function Sets({
  nestIndex,
  control,
  register,
  watch,
}: {
  nestIndex: number;
  control: any;
  register: any;
  watch: any;
}) {
  const { fields, remove, append } = useFieldArray({
    control,
    name: `exercises[${nestIndex}].sets`,
  });

  return (
    <div className="sets-container">
      <div className="sets-header">
        <h4>Sets</h4>
        <span className="set-count">{fields.length} set(s)</span>
      </div>

      <div className="sets-list">
        {fields.map((item, k) => {
          // Watch the isBodyWeight checkbox for this set
          const isBodyWeightPath = `exercises[${nestIndex}].sets[${k}].isBodyWeight`;
          const isBodyWeight = watch(isBodyWeightPath);

          return (
            <div key={item.id} className="set-row">
              <div className="set-number">
                <span>{k + 1}</span>
              </div>

              <div className="set-inputs">
                <div className="upper-row">
                  <div
                    className={`input-group ${isBodyWeight ? "disabled" : ""}`}
                  >
                    <label>Weight</label>
                    <div className="input-with-unit">
                      <input
                        {...register(
                          `exercises[${nestIndex}].sets[${k}].weight`,
                          {
                            required: !isBodyWeight, // Only required if not body weight
                            valueAsNumber: true,
                          },
                        )}
                        type="number"
                        placeholder={isBodyWeight ? "Body weight" : "0"}
                        className="set-input"
                        disabled={isBodyWeight}
                      />
                      <span className="input-unit">kg</span>
                    </div>
                  </div>

                  <div className="input-group">
                    <label>Reps</label>
                    <div className="input-with-unit">
                      <input
                        {...register(
                          `exercises[${nestIndex}].sets[${k}].reps`,
                          {
                            required: true,
                            valueAsNumber: true,
                          },
                        )}
                        type="number"
                        placeholder="0"
                        className="set-input"
                      />
                      <span className="input-unit">reps</span>
                    </div>
                  </div>
                </div>
                <div className="lower-row">
                  <label className="checkbox-label">
                    <input
                      {...register(
                        `exercises[${nestIndex}].sets[${k}].isBodyWeight`,
                      )}
                      type="checkbox"
                      className="bodyweight-checkbox"
                    />
                    <span className="checkbox-text">Body Weight Exercise</span>
                  </label>
                </div>
              </div>

              <button
                type="button"
                onClick={() => remove(k)}
                className="remove-set-btn"
                title="Remove set"
              >
                <Icons.Trash />
              </button>
            </div>
          );
        })}
      </div>

      <button
        type="button"
        onClick={() =>
          append({
            weight: 0,
            reps: 0,
            isBodyWeight: false,
          })
        }
        className="add-set-btn"
      >
        <svg viewBox="0 0 24 24" fill="currentColor" width="18" height="18">
          <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z" />
        </svg>
        <span>Add Set</span>
      </button>
    </div>
  );
}
