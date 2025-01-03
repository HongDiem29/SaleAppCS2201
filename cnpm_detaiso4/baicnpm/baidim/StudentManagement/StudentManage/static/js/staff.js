let quantity_student = 0
let quantity_student_in_class = 0
lop_id = 0

function Chuyenlop() {
    fetch("/api/Chuyenlop", {
        method: "post",
        body: JSON.stringify({
            "hs_id": document.getElementById('hs_id').value,
            "lop_id": document.getElementById('lop_id').value
        }),
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(function(res) {
        return res.json();
    }).then(function(data) {
        document.getElementById('btn_chuyenlop').blur();
        let a = document.getElementById('Chuyenlop');
        a.innerHTML = `<div class="alert ${data.content === "Thành công" ? 'alert-success' : 'alert-danger'}">${data.content}</div>`;

        // Tự động tắt thông báo sau 3 giây
        setTimeout(function() {
            a.innerHTML = ''; // Xóa nội dung thông báo
        }, 3000);
    });
}

function Timkiemhs() {
    const searchInput = document.getElementById('timkiemhs').value.trim(); // Lấy giá trị ô tìm kiếm và loại bỏ khoảng trắng
    const noResultElement = document.getElementById('no_result_timkiemhs');
    const resultElement = document.getElementById('result_timkiemhs');
    const table = document.getElementById('table_result');

    // Kiểm tra nếu ô tìm kiếm trống
    if (searchInput === "") {
        noResultElement.style.display = "none"; // Ẩn thông báo không tìm thấy
        resultElement.style.display = "none"; // Ẩn danh sách kết quả
        return; // Ngưng thực hiện hàm
    }

    fetch("/api/Timkiemhs", {
        method: "post",
        body: JSON.stringify({
            "timkiemhs": searchInput
        }),
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(function(res) {
        return res.json();
    }).then(function(data) {
        // Kiểm tra số lượng học sinh tìm thấy
        if (data[0].quantity === 0) {
            noResultElement.style.display = "inline";
            noResultElement.innerHTML = `<div class="alert alert-success">Không tìm thấy học sinh</div>`;
            resultElement.style.display = "none"; // Ẩn danh sách kết quả
        } else {
            noResultElement.style.display = "none"; // Ẩn thông báo không tìm thấy
            resultElement.style.display = "inline"; // Hiển thị danh sách kết quả

            // Xóa các hàng cũ trong bảng
            while (table.rows.length > 1) {
                table.deleteRow(1);
            }

            const quantity_student = data[0].quantity;

            for (let j = 1; j <= quantity_student; j++) {
                var row = table.insertRow();
                row.insertCell().innerText = data[j].id;
                row.insertCell().innerText = data[j].tenHs;
                row.insertCell().innerText = data[j].lop;
            }
        }
    }).catch(function(error) {
        console.error('Error:', error); // Xử lý lỗi nếu có
        noResultElement.style.display = "inline"; // Có thể hiển thị thông báo lỗi
        noResultElement.innerHTML = `<div class="alert alert-danger">Đã xảy ra lỗi trong quá trình tìm kiếm.</div>`;
        resultElement.style.display = "none"; // Ẩn danh sách kết quả
    });
}


function Xuatlop(id) {
    fetch("/api/Xuatlop", {
        method: "post",
        body: JSON.stringify({
            "lop_id": id,
        }),
        headers: {
            'Content-Type': 'application/json'
        }
    }).then(function(res) {
        return res.json();
    }).then(function(data) {
        let idElement = document.getElementById(data[0].id);
        idElement.classList.add("active");

        if (lop_id != 0) {
            let id_remove = document.getElementById(lop_id);
            id_remove.classList.remove("active");
        }

        lop_id = data[0].id;
        let a = document.getElementById('no_student');
        let b = document.getElementById('print_class');
        let table = document.getElementById('table_print_class');


        while (table.rows.length > 1) {
            table.deleteRow(1);
        }

        if (data[0].quantity == 0) {
            a.style.display = "inline";
            a.innerHTML = `<div class="alert alert-info text-center">Lớp không có học sinh</div>`;
            b.style.display = "none";
        } else {
            let tenLop = document.getElementById('tenLop');
            tenLop.innerText = `Lớp: ${data[0].class}`;
            let quantity = document.getElementById('quantity');
            quantity.innerText = `Sĩ số: ${data[0].quantity}`;

            a.style.display = "none";
            b.style.display = "inline";

            quantity_student_in_class = data[0].quantity;


            for (let i = 0; i < data[0].quantity; i++) {
                var row = table.insertRow();
                row.insertCell().innerText = i + 1;
                row.insertCell().innerText = data[i + 1].tenHs;
                row.insertCell().innerText = data[i + 1].gioiTinh;
                row.insertCell().innerText = data[i + 1].ngaysinh;
                row.insertCell().innerText = data[i + 1].diaChi;
            }
        }
    });
}

function xuatloptruoc(){
    if (lop_id == 0)
        Xuatlop(16)
    else if (lop_id == 1)
        Xuatlop(16)
    else
        Xuatlop(lop_id - 1)
}

function xuatloptip(){
    if (lop_id == 0)
        Xuatlop(1)
    else if (lop_id == 16)
        Xuatlop(1)
    else
        Xuatlop(lop_id + 1)
}