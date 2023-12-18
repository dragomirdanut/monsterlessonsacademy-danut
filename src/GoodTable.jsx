import { useEffect, useRef, useState } from "react";
import classes from "./Table.module.css";

const GoodTable = ({ issues }) => {
  const selectAllRef = useRef();
  const convertIssuesToEntries = (isSelected) => {
    const entries = issues.map((issue) => [
      issue.id,
      { isSelected: issue.status === "open" ? isSelected : false },
    ]);
    return Object.fromEntries(entries);
  };
  const [issueEntries, setIssueEntries] = useState(() =>
    convertIssuesToEntries(false)
  );
  const totalSelected = Object.values(issueEntries).filter(
    (issueData) => issueData.isSelected
  ).length;

  const selectRow = (issueId) => {
    const updatedIssueEntry = {
      ...issueEntries[issueId],
      isSelected: !issueEntries[issueId].isSelected,
    };
    const updatedIssueEntries = {
      ...issueEntries,
      [issueId]: updatedIssueEntry,
    };
    setIssueEntries(updatedIssueEntries);
  };

  const selectAll = (event) => {
    const updatedIssueEntries = convertIssuesToEntries(event.target.checked);
    setIssueEntries(updatedIssueEntries);
  };

  useEffect(() => {
    const totalOpenedIssues = issues.filter((issue) => issue.status === "open")
      .length;
    const indeterminate =
      totalSelected < totalOpenedIssues && totalSelected > 0;
    selectAllRef.current.indeterminate = indeterminate;
  }, [totalSelected, issues]);

  return (
    <table className={classes.table}>
      <thead>
        <tr>
          <th>
            <input
              className={classes.checkbox}
              type="checkbox"
              checked={totalSelected}
              ref={selectAllRef}
              onChange={selectAll}
            />
          </th>
          <th className={classes.numChecked}>
            {totalSelected ? `Selected ${totalSelected}` : "None selected"}
          </th>
        </tr>
        <tr>
          <th />
          <th>Name</th>
          <th>Message</th>
          <th>Status</th>
        </tr>
      </thead>

      <tbody>
        {issues.map((issue) => {
          const isOpenedIssue = issue.status === "open";
          const backgroundColor = issueEntries[issue.id].isSelected
            ? "#eeeeee"
            : "#ffffff";
          const statusClass = isOpenedIssue
            ? classes.openCircle
            : classes.resolvedCircle;
          const rowClass = isOpenedIssue
            ? classes.openIssue
            : classes.resolvedIssue;

          return (
            <tr
              className={rowClass}
              style={{ backgroundColor }}
              key={issue.id}
              onClick={() => selectRow(issue.id)}
            >
              <td>
                <input
                  className={classes.checkbox}
                  type="checkbox"
                  readOnly
                  checked={issueEntries[issue.id].isSelected}
                  disabled={!isOpenedIssue}
                />
              </td>
              <td>{issue.name}</td>
              <td>{issue.message}</td>
              <td>
                <span className={statusClass} />
              </td>
            </tr>
          );
        })}
      </tbody>
    </table>
  );
};
export default GoodTable;
