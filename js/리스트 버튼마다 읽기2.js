$(document).ready(function () {
    // 초기 데이터 출력
    displayData();
});

// 이전에 클릭한 버튼의 상태를 저장하는 변수
var previousStatus = "";

// 초기 데이터 출력 함수
function displayData() {
    $.getJSON("./json/Gdata.json", function (data) {
        // 초기에는 이전에 클릭한 버튼의 상태에 따라 데이터를 렌더링
        renderData(data, previousStatus);
    });
}

// 버튼 클릭 시 스타일 및 데이터 필터링 함수
function buttonClick(status, buttonElement) {
    if (previousStatus === status) {
        // 이미 클릭된 상태일 때는 클릭을 해제하고 스타일을 원래대로 변경
        previousStatus = "";
        $(".filter-btn").removeClass("btn-on");
    } else {
        // 클릭되지 않은 상태일 때는 클릭을 설정하고 스타일을 변경
        previousStatus = status;
        $(".filter-btn").removeClass("btn-on");
        $(buttonElement).addClass("btn-on");
    }
    // 버튼을 클릭할 때마다 데이터를 렌더링
    renderData(data, previousStatus);
}

// 버튼 클릭 시 스타일 및 데이터 필터링 함수
function buttonClick2(value, checkboxElement) {
    // Toggle the checkbox state
    $(checkboxElement).prop('checked', !$(checkboxElement).prop('checked'));

    // Get all checked values
    var checkedValues = $(".filter-checkbox:checked").map(function () {
        return $(this).data("value");
    }).get();

    // Update the styling
    $(".filter-checkbox").removeClass("btn-on");
    checkedValues.forEach(function (val) {
        $(".filter-checkbox[data-value='" + val + "']").addClass("btn-on");
    });

    // Render data based on the filter status
    renderData(data, checkedValues);
}

// 검색 버튼 클릭 시 이전에 클릭한 버튼의 상태에 따라 데이터 필터링 함수
function searchData() {
    $.getJSON("./json/Gdata.json", function (data) {
        // 이전에 클릭한 버튼의 상태에 따라 데이터 필터링
        renderData(data, previousStatus);
    });
}

// 전체 리스트를 보여주는 함수
function showAllData() {
    previousStatus = ""; // 전체보기 버튼을 눌렀을 때 이전에 클릭한 상태 초기화
    $(".filter-btn").removeClass("btn-on");
    // 버튼을 클릭할 때마다 데이터를 렌더링
    renderData(data, "");
}
// 데이터를 화면에 렌더링하는 함수
function renderData(data, agencies) {
    // 현재 날짜 가져오기
    var currentDate = new Date();

    // 할 일 처리
    let member_data = "";
    $.each(data, function (key, value) {
        // 신청기간의 시작과 끝 날짜 가져오기
        var 신청기간 = value.신청기간;
        var startDate, endDate;

        if (신청기간 && 신청기간 !== "~") {
            // 신청기간이 "~"가 아닌 경우도 포함시키기
            [startDate, endDate] = 신청기간.split(" ~ ");
        }

        // 각 체크박스에 대한 조건문
        if (
            (!agencies || (agencies.length > 0 && agencies.some(ag => value.담당기관.includes(ag)))) &&
            (!previousStatus ||
                (previousStatus === "모집중" && (!신청기간 || 신청기간 === "~" || (currentDate >= new Date(startDate) && currentDate <= new Date(endDate)))) ||
                (previousStatus === "금정구" && (value.담당기관.includes("금정구") || value.담당기관.includes("스타트허브"))) ||
                (previousStatus === "사하구" && value.담당기관.includes("사하")) ||
                (previousStatus === "해운대구" && value.담당기관.includes("해운대")) ||
                (previousStatus === "남구" && value.담당기관.includes("남구")) ||
                (previousStatus === "북구" && value.담당기관.includes("북구")))
        ) {
            member_data += "<div class='info-box'>";
            member_data += "<p><strong>정책이름</strong>: " + value.정책이름 + "</p>";
            member_data += "<p><strong>URL</strong>: <a href='" + value.URL + "' target='_blank'>" + value.URL + "</a></p>";
            member_data += "<p><strong>신청기간</strong>: " + (value.신청기간 || "미정") + "</p>";
            member_data += "<p><strong>담당기관</strong>: " + value.담당기관 + "</p>";
            member_data += "</div>";
        }
    });

    $("#data-container").html(member_data);
}
