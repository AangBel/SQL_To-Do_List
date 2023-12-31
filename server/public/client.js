$(document).ready(onReady);

function onReady() {
  console.log("Client side javascript works!");
  $("#add_btn").on("click", addButtonFunction);
  $("#taskDiv").on("click", ".delete-btn", deleteTaskButton);
  $("#taskDiv").on("click", ".check", doneCheckMark);

  getTasks();
} //end of onready

let currentStatus = $(this).data("check-id");
console.log("this should be the current status", currentStatus);

function doneCheckMark() {
  const button = $(this);
  const row = button.closest("tr");

  row.addClass("row-green");

  let taskID = $(this).data("task-id");
  console.log("this should be the taskID", taskID);

  let currentStatus = $(this).data("check-id");
  console.log("this should be the current status", currentStatus);

  const taskToCheck = {
    status: true,
  };

  $.ajax({
    method: "PUT",
    url: `/tasks/${taskID}`,
    data: taskToCheck,
  })
    .then(function (response) {
      console.log(`Task marked as complete: ${taskID}`);
      getTasks();
    })
    .catch(function (error) {
      console.error("Error marking task as complete:", error);
    });
}

function addButtonFunction() {
  let taskInput = $("#taskText").val();
  console.log("this should be the task input value:", taskInput);

  let taskToSend = {
    task: taskInput,
  };
  console.log("this should be the task to send", taskToSend);

  $.ajax({
    method: "POST",
    url: "/tasks",
    data: taskToSend,
  })
    .then(function (response) {
      console.log(response);
      let taskInput = $("#taskText").val("");
      getTasks();
    })
    .catch(function (error) {
      console.log("error in tasks post under add button function", error);
    });
} //end of addButtonFunction

function getTasks() {
  console.log("in getTasks");

  $.ajax({
    method: "GET",
    url: "/tasks",
  })
    .then(function (response) {
      const tasksToReceive = response;
      console.log("retrieved data", tasksToReceive);
      const taskTableBody = $("#taskDiv tbody");
      taskTableBody.empty();

      for (let tasks of tasksToReceive) {
        const statusText = tasks.status ? "Complete" : "Incomplete";
        const rowClass = tasks.status ? "row-green" : "";

        $("#taskTableBody").append(`
        <tr class="row ${rowClass}">
        <td>${tasks.task}</td>
        <td>${statusText}</td>
        <td>
        <button class="check" data-task-id="${tasks.id}" data-check-id="${tasks.status}">✅</button>
        </td>
        <td>
        <button class="delete-btn" 
        data-task-id=${tasks.id}>Delete</button>
        </tr>
                  `);
      }
    })
    .catch(function (error) {
      console.log("error in tasks get in get tasks function", error);
    });
} // end getTasks

function deleteTaskButton() {
  console.log("clicked the delete button");

  let idToDelete = $(this).data("task-id");
  console.log(this);

  console.log(idToDelete);

  $.ajax({
    method: "DELETE",
    url: `/tasks/${idToDelete}`,
  })
    .then((results) => {
      console.log(
        "delete successful, this item no longer exists: ",
        idToDelete
      );
      getTasks();
    })
    .catch((err) => {
      alert("Error on delete, id:", idToDelete);
    });
} //end of delete task button
