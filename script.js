const localStorageKey = "students";

// Dohvati obrazac iz DOM-a i pohrani u konstantu objekt obrasca
const createStudentForm = document.querySelector("#createStudentForm");
// Dohvati body tablice iz DOM-a i pohrani kao objekt u konstantu
const studentTableBody = document.querySelector("#students tbody");
// Dohvati modal iz DOM-a i pohrani kao objekt u konstantu
const studentModal = document.querySelector("#studentModal");
// Kreiraj objekt modala
const studentModalObj = new bootstrap.Modal(studentModal, {});

loadStudentsFromLocalStorage();

// Dodavanje funckije kao listener za event submit
createStudentForm.addEventListener("submit", handleCreateStudent);
studentModal.addEventListener("shown.bs.modal", function () {
  createStudentForm[1].focus();
});
studentModal.addEventListener("hidden.bs.modal", function () {
  createStudentForm.reset();
  createStudentForm.querySelector("input#currentOib").value = "";
});

// Funkcija koja će se aktivirati kada se dogodi event submit nad objektom obrasca
function handleCreateStudent(e) {
  e.preventDefault();

  let formData = new FormData(e.target);
  let student = {};
  for (const iterator of formData.entries()) {
    student[iterator[0]] = iterator[1];
  }

  if (student.currentOib) {
    updateStudent(student);
    return;
  }

  createStudent(student);
}

function createStudent(student) {
  addStudentToTable(student);
  addStudentToStorage(student);
  studentModalObj.hide();
}

function updateStudent(student) {
  const records = localStorage.getItem(localStorageKey);
  if (records) {
    let students = JSON.parse(records);
    students = students.map(function (value) {
      if (student.currentOib == value.oib) {
        {
          value.ime = student.ime;
          value.prezime = student.prezime;
          value.oib = student.oib;
        };
      }

      return value;
    });

    localStorage.setItem(localStorageKey, JSON.stringify(students));
    loadStudentsFromLocalStorage();
    studentModalObj.hide();
  }
}

// Dodaj studenta u tablicu koja se nalazi u DOM-u
function addStudentToTable(student) {
  const tr = document.createElement("tr");

  for (const key in student) {
    if (key != "currentOib") {
      const td = document.createElement("td");
      td.innerText = student[key];
      tr.append(td);
    }
  }

  const td = document.createElement("td");
  td.style.width = "150px";

  const deleteBtn = document.createElement("button");
  deleteBtn.type = "button";
  deleteBtn.className = "btn btn-danger btn-sm ms-1";
  deleteBtn.innerText = "Izbriši";
  deleteBtn.dataset.oib = student.oib;
  deleteBtn.addEventListener("click", handleDeleteStudent);
  td.append(deleteBtn);

  const editBtn = document.createElement("button");
  editBtn.type = "button";
  editBtn.className = "btn btn-primary btn-sm ms-1";
  editBtn.innerText = "Uredi";
  editBtn.dataset.oib = student.oib;
  editBtn.addEventListener("click", handleEditStudent);
  td.prepend(editBtn);

  tr.append(td);
  studentTableBody.append(tr);
}

// Izbriši studenta kada korisnik klikne na gumb Izbriši
function handleDeleteStudent(e) {
  e.preventDefault();

  if (!confirm("Jesi li siguran?")) {
    return;
  }

  const oib = e.target.dataset.oib;
  deleteStudentFromLocalStorage(oib);

  e.target.parentNode.parentNode.remove();
}

// Podigni modal i popuni obrazac s podacima studenta iz retka u kojem se nalazi gumb edit na koji je korisnik kliknuo
function handleEditStudent(e) {
  e.preventDefault();

  const oib = e.target.dataset.oib;
  const records = localStorage.getItem(localStorageKey);

  if (records) {
    const students = JSON.parse(records);
    const student = students.find(function (student) {
      return student.oib == oib;
    });

    if (student) {
      createStudentForm.querySelector("input#currentOib").value = student.oib;
      createStudentForm.querySelector("input#ime").value = student.ime;
      createStudentForm.querySelector("input#prezime").value = student.prezime;
      createStudentForm.querySelector("input#oib").value = student.oib;
    }

    studentModalObj.show();

    return;
  }

  console.warn("Problem with users!");
}

// dodaj studenta u lokalnu pohranu
function addStudentToStorage(student) {
  const records = localStorage.getItem(localStorageKey);
  let students = [];

  if (records) {
    students = JSON.parse(records);
  }

  students.push(student);

  localStorage.setItem(localStorageKey, JSON.stringify(students));
}

// Izbriši studenta iz lokalne pohrane
function deleteStudentFromLocalStorage(oib) {
  const records = localStorage.getItem(localStorageKey);

  if (records) {
    const students = JSON.parse(records);

    const newStudents = students.filter(function (student) {
      return student.oib != oib;
    });

    localStorage.setItem(localStorageKey, JSON.stringify(newStudents));
  }
}

// učitaj studente iz lokalne pohrane i prikaži ih u tablici
function loadStudentsFromLocalStorage() {
  studentTableBody.innerHTML = "";

  const records = localStorage.getItem(localStorageKey);

  if (records) {
    const students = JSON.parse(records);
    students.forEach(function (student) {
      addStudentToTable(student);
    });
  }
}
