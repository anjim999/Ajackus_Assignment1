function loadEmployees() {
  const data = localStorage.getItem("employees");
  return data ? JSON.parse(data) : null;          
}

function saveEmployees(list) {
  localStorage.setItem("employees", JSON.stringify(list));
}

let employees = loadEmployees();

if (!employees) {                               
  employees = [
    { id: "E001", firstName: "Alice",   lastName: "Johnson", email: "alice@example.com",   department: "HR",     role: "Manager"   },
    { id: "E002", firstName: "Bob",     lastName: "Smith",   email: "bob@example.com",     department: "IT",     role: "Developer" },
    { id: "E003", firstName: "Charlie", lastName: "Lee",     email: "charlie@example.com", department: "Finance",role: "Analyst"   }
  ];
  saveEmployees(employees);
}

function renderEmployees() {
  const container   = document.getElementById("employeeList");
  const search      = (document.getElementById("searchInput")?.value || "").toLowerCase();
  const sortKey     = document.getElementById("sortSelect")?.value;
  const limit       = parseInt(document.getElementById("showCount")?.value || 10);

  const filterFirst = (document.getElementById("filterFirstName")?.value || "").toLowerCase();
  const filterDept  = (document.getElementById("filterDepartment")?.value || "").toLowerCase();
  const filterRole  = (document.getElementById("filterRole")?.value || "").toLowerCase();

  container.innerHTML = "";

  let list = employees.filter(emp =>
       (emp.firstName.toLowerCase().includes(search) ||
        emp.lastName .toLowerCase().includes(search) ||
        emp.email    .toLowerCase().includes(search)) &&
       emp.firstName .toLowerCase().includes(filterFirst) &&
       emp.department.toLowerCase().includes(filterDept)  &&
       emp.role      .toLowerCase().includes(filterRole)
  );

  if (sortKey) list.sort((a,b)=>a[sortKey].localeCompare(b[sortKey]));

list.slice(0, limit).forEach(emp => {
  const card = document.createElement("div");
  card.className = "employee-card";
  card.innerHTML = `
    <div class="card-content">
      <div class="card-info">
        <div><strong>${emp.firstName} ${emp.lastName}</strong></div>
        <div>Email: ${emp.email}</div>
        <div>Department: ${emp.department}</div>
        <div>Role: ${emp.role}</div>
      </div>
      <div class="card-actions">
        <button onclick="editEmployee('${emp.id}')">Edit</button>
        <button onclick="deleteEmployee('${emp.id}')">Delete</button>
      </div>
    </div>
  `;
  container.appendChild(card);
});

}

function deleteEmployee(id) {
  const idx = employees.findIndex(e=>e.id===id);
  if (idx !== -1 && confirm("Delete this employee?")) {
    employees.splice(idx,1);
    saveEmployees(employees);
    renderEmployees();
  }
}

function editEmployee(id) {
  const emp = employees.find(e=>e.id===id);
  if (emp) {
    localStorage.setItem("editEmployee", JSON.stringify(emp));
    window.location.href = "add_edit.html";
  }
}

function saveEmployee(e) {
  e.preventDefault();

  const emp = {
    id:  "E" + Math.floor(Math.random()*1000000),
    firstName:  document.getElementById("firstName").value.trim(),
    lastName:   document.getElementById("lastName") .value.trim(),
    email:      document.getElementById("email")    .value.trim(),
    department: document.getElementById("department").value,
    role:       document.getElementById("role")      .value
  };

  const editData = JSON.parse(localStorage.getItem("editEmployee"));
  if (editData) {
    const idx = employees.findIndex(e=>e.id===editData.id);
    if (idx !== -1) employees[idx] = { ...emp, id: editData.id };
    localStorage.removeItem("editEmployee");
  } else {
    employees.push(emp);
  }

  saveEmployees(employees);
  alert("Employee saved!");
  window.location.href = "index.html";
}

function resetFilters() {
  ["filterFirstName","filterDepartment","filterRole"].forEach(id=>document.getElementById(id).value="");
  renderEmployees();
}

function toggleFilter() {
  document.getElementById("filterSidebar").classList.toggle("hidden");
}

window.onload = () => {
  employees = loadEmployees() || [];          
  if (document.getElementById("employeeList")) {
    renderEmployees();                        
  }

  const editData = JSON.parse(localStorage.getItem("editEmployee"));
  if (editData) {                            
    ["firstName","lastName","email","department","role"].forEach(
      k => document.getElementById(k).value = editData[k]
    );
    document.getElementById("formTitle").innerText = "Edit Employee";
  }
};
