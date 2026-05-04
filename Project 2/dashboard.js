let bookings = [];

// menu button toggle
const menuBtn = document.getElementById("menuBtn");
const sidebar = document.querySelector(".sidebar");

menuBtn.addEventListener("click", () => {
    if (window.innerWidth <= 768) {
    sidebar.classList.toggle("closed");
    }
});

// MENU ACTIVE
const menus = document.querySelectorAll(".menu");

menus.forEach(menu => {
    menu.addEventListener("click", () => {
        menus.forEach(m => m.classList.remove("active"));
        menu.classList.add("active");

        const page = menu.getAttribute("data-page");
        loadPage(page);
    });
});

// Table content
const content = document.getElementById("content");

function loadPage(page) {
    if (page === "dashboard") {
        content.innerHTML = `
            <h1>Dashboard</h1>
            <div class="stats">
                <div class="card">Bookings<br><b>7</b></div>
                <div class="card">Guests<br><b>206</b></div>
                <div class="card">Revenue<br><b>RM23,750</b></div>
                <div class="card">Rooms<br><b>50</b></div>
            </div>

            <div class="card">
                <canvas id="bookingChart"></Canvas>
            </div>
        `;

        //take/calc data from booking to chart
        const statusCount = {
            Confirm: 0,
            Pending: 0,
            "Check-In": 0,
        };

        bookings.forEach(b => {
            if (statusCount[b.Status] !== undefined) {
                statusCount[b.Status]++;
            }
        });

        //create chart
        const ctx = document.getElementById("bookingChart");

        new Chart(ctx, {
            type: "bar",
            data: {
                labels: ["Confirm", "Pending", "Check-In"],
                datasets: [{
                    label: "Bookings",
                    data: [
                        statusCount.Confirm,
                        statusCount.Pending,
                        statusCount["Check-In"]
                    ],

                    // chart color
                    backgroundColor: [
                        "#3498db",  // Confirm
                        "#f1c40f", // Pending
                        "#2ecc71" // Check in
                    ],

                    // border color
                    borderColor: "#00ffc3",
                    borderWidth: 1.5,

                    // hover color
                    hoverBackgroundColor: [
                        "#216796",
                        "#9c7f09",
                        "#1c7742"
                    ]
                }]
            },

            // chart text color
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        labels: {
                            color: "white"
                        }
                    }
                },

            // grid line color
            scales: {
                x: {
                    ticks: { color: "white" },
                    grid: { color: "rgba(255,255,255,0.1)" }
                },
                y: {
                    ticks: { color: "white" },
                    grid: { color: "rgba(255,255,255,0.1)" }
                }
            }
        }
    });
}

    // booking table
    if (page === "bookings") {

    let rows = "";

    //filter booking data based on current date
    const currentBookings = bookings.filter(b =>
        new Date(b.Check_Out_Date) >= new Date()
    );

    currentBookings.forEach(b => {
        rows += `
            <tr>
                <td>${b.Guest_Name}</td>
                <td>${b.Check_In_Date}</td>
                <td>${b.Check_Out_Date}</td>
                <td>${b.Number_of_Stays}</td>
                <td>${b.Number_of_Guest}</td>
                <td>${b.Room_Type}</td>
                <td class="status ${b.Status}">${b.Status}</td>
            </tr>
        `;
    });

    content.innerHTML = `
        <h1>Bookings</h1>

        <div class="table-container">
            <table>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Check In Date</th>
                        <th>Check Out Date</th>
                        <th>Day(s) of Stay</th>
                        <th>Number of Guests</th>
                        <th>Room Type</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    ${rows}
                </tbody>
            </table>
        </div>
    `;
}


    if (page === "guests") {

        let rows = "";

        const pastGuests = bookings.filter(b =>
            new Date(b.Check_Out_Date) < new Date()
        );

        pastGuests.forEach(b => {
        rows += `
            <tr>
                <td>${b.Guest_Name}</td>
                <td>${b.Check_In_Date}</td>
                <td>${b.Check_Out_Date}</td>
                <td>${b.Number_of_Stays}</td>
                <td>${b.Number_of_Guest}</td>
                <td>${b.Room_Type}</td>
                <td class="status ${b.Status}">${b.Status}</td>
            </tr>
        `;
    });

        content.innerHTML = `
            <h1>Bookings</h1>

        <div class="table-container">
            <table>
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Check In Date</th>
                        <th>Check Out Date</th>
                        <th>Day(s) of Stay</th>
                        <th>Number of Guests</th>
                        <th>Room Type</th>
                        <th>Status</th>
                    </tr>
                </thead>
                <tbody>
                    ${rows}
                </tbody>
            </table>
        </div>
    `;
}

    if (page === "settings") {
        content.innerHTML = `
            <h1>Settings</h1>
            <p>Settings panel...</p>
        `;
    }
}

// fetch data from data.json
fetch("data.json")
.then(res => res.json())
.then(data => {
    bookings = data;
      loadPage("dashboard"); // auto load lepas data siap
})
.catch(err => console.error("Error loading data:", err));

// filter data
const today = new Date();

const currentBookings = bookings.filter(b => {
    return new Date(b.Check_Out_Date) >= today;
});

const pastGuests = bookings.filter(b => {
    return new Date(b.Check_Out_Date) < today;
});