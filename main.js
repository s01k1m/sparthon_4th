// create bucket

let item_index = 0

function create_bucket() {
  user_bucket = document.getElementById("text_input").value; // input value 가져오기

  if ( user_bucket ) {
    const bucketItem = document.createElement("li"); // li 생성
    const textNode = document.createTextNode(user_bucket);
    const buttonNode = document.createElement("button")

    bucketItem.setAttribute("id", item_index)
    bucketItem.onclick = (e) => make_Done(e); // 클릭시 완료 
    bucketItem.setAttribute('class',"bucketItem"+" "+textNode+ " undone"); // bucket Item 설정시작
    bucketItem.appendChild(textNode); // input value를 가진 li 생성 
    // 버킷아이템 삭제버튼 
    buttonNode.onclick = (e) => delete_bucket(e);

    buttonNode.classList.add("item_delete_button")
    bucketItem.appendChild(buttonNode)


    const bucketList = document.getElementById("bucketList")
    bucketList.appendChild(bucketItem) // li를 ul에 추가
  }
  item_index += 1
  document.getElementById("text_input").value = ""; // 인풋창 비우기
}

function delete_bucket(event){
  event.preventDefault;
  const button = event.target; // 클릭된 버튼 요소 가져오기
  const bucketItem = button.parentNode; // 버튼의 부모 요소인 버킷 아이템(li) 가져오기
  const target_index = bucketItem.id.trim(); // 버킷 아이템의 id 가져오기 (공백 제거)

  let bucketListItems = document.querySelectorAll(".bucketItem");
  console.log(bucketListItems)
  bucketListItems.forEach(item => {
    console.log(item.innerText, target_index)
    if (item.id === target_index) {
      console.log("삭제")
      item.remove();
    }
  });
}

// Done 기능;
function make_Done(event) {
  const bucketItem = event.target;
  if (bucketItem.classList.contains("done")) {
    bucketItem.classList.remove("done");
    bucketItem.classList.add("undone");
  } else {
    bucketItem.classList.remove("undone");
    bucketItem.classList.add("done");
  }
}
