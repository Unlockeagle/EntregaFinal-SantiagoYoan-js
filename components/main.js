const API_URL = "https://leonardoapi.onrender.com/music";
let arrPlayList = JSON.parse(localStorage.getItem("arrPlayList"));

arrPlayList == null ? (arrPlayList = []) : renderPlayList();
// if (arrPlayList == null) {
//   arrPlayList = [];
// }
const arrData = [];

fetch(API_URL)
  .then((res) => res.json())
  .then((data) => {
    mostarCanciones(data);
    mostraPlayBtns();
    playList();
    miniaturaAudio(data);
    arrayData(data);
  })
  .catch((error) => console.error("Hubo un error", error));

function mostarCanciones(data) {
  const contenedorCanciones = document.getElementById("contenedorCanciones");
  console.log(contenedorCanciones.children.length);
  if (contenedorCanciones.children.length === null) {
    setTimeout(() => {
      console.log("iniciando API...")
    }, 3000);

    // Mesaje cuando la API esta apagada
    Toastify({
      text: `Por favor espere mientras se inicia la API suele tardar 1 minuto (T T) `,
      duration: 10000,
      destination: "https://github.com/apvarun/toastify-js",
      newWindow: true,
      close: true,
      gravity: "top", // `top` or `bottom`
      position: "center", // `left`, `center` or `right`
      stopOnFocus: true, // Prevents dismissing of toast on hover
      style: {
        background: "linear-gradient(to right, #202020, #202020)",
      },
      onClick: function(){} // Callback after click
    }).showToast();
    
  } console.log("API Iniciada");

  

  data.forEach((canciones) => {
    
    const cards = document.createElement("div");
    cards.id = "cardId";

    cards.className = "cardId hover:bg-slate-800 rounded-lg p-4 ";
    contenedorCanciones.append(cards);
    cards.innerHTML = `
            <div class="img-container w-52 h-60 rounded-lg overflow-hidden relative">
            <button 
                id="likeBtn" 
                class="likeBtn rounded-full w-14 h-14 sticky mt-0 top-0 left-0 z-10 opacity-0 transition delay-75 ease-in-out " 
                >
                <i class="text-red-600 text-2xl hover:text-3xl bi bi-heart-fill shadow-slate-800 drop-shadow-lg"></i>
            </button>
            <img class="imgCard rounded-lg max-w-full object-cover top-0 absolute" src="${canciones.path.front}">
            <button 
                id="playBtn" 
                class="playBtn bg-green-600 rounded-full w-16 h-16 absolute mt-0 bottom-0 left-32 opacity-0 transition delay-75 ease-in-out shadow-slate-800 shadow-lg" 
                data-audio="${canciones.path.audio}"
                >
                <i class="text-4xl bi bi-play-circle align-middle"></i>
            </button>
            </div>
            <div class="text-container">            
            <h2 class="title text-lg text-wrap w-52"><strong>Titulo: ${canciones.title}</strong></h2>
            <h2 class="author text-sm text-wrap w-52">Author: ${canciones.author}</h2>
            </div>
            `;
  });
}
// Crea un array con los datos recibidos desde el fecht
function arrayData(data) {
  data.forEach((cancion) => {
    arrData.push(cancion);
  });
}

console.log(arrData);

function mostraPlayBtns() {
  const cards = document.querySelectorAll(".cardId");
  
  cards.forEach((cards) => {
    const playBtn = cards.querySelector(".playBtn");
    const likeBtn = cards.querySelector(".likeBtn");
    const imgCard = cards.querySelector(".imgCard");

    cards.addEventListener("mouseover", () => {
      playBtn.classList.add(
        "opacity-100",
        "bottom-10",
        "transition",
        "delay-50",
        "ease-in"
      );
      likeBtn.classList.add("opacity-75");
      imgCard.classList.add("scale-110");
    });

    cards.addEventListener("mouseout", () => {
      playBtn.classList.remove(
        "opacity-100",
        "bottom-10",
        "transition",
        "delay-50",
        "ease-in"
      );
      likeBtn.classList.remove("opacity-75");
      imgCard.classList.remove("scale-110");
    });

    playBtn.addEventListener("click", () => {
      
      Toastify({
        text: `Reproduciendo`,  // puedo agregar el titulo de la cancion aqui...
        duration: 5000,
        destination: "https://github.com/apvarun/toastify-js",
        newWindow: true,
        close: true,
        gravity: "top", // `top` or `bottom`
        position: "right", // `left`, `center` or `right`
        stopOnFocus: true, // Prevents dismissing of toast on hover
        style: {
          background: "linear-gradient(to right, #202020, #202020)",
        },
        onClick: function(){} // Callback after click
      }).showToast();
      const audioSrc = playBtn.getAttribute("data-audio");
      reproducirAudio(audioSrc);
      
    });
  });
}
function reproducirAudio(src) {
  // Detener la reproducción de cualquier audio que se esté reproduciendo actualmente
  const audios = document.querySelectorAll("audio");
  audios.forEach((audio) => {
    audio.pause();
  });
  const playBtnLike = document.querySelectorAll("audioPL");

  // Crear un nuevo elemento de audio
  const audio = new Audio(src);
  audio.controls = true;

  // Agregar el nuevo elemento de audio al contenedor de audio
  const audioContainer = document.getElementById("audioContainer");
  audioContainer.innerHTML = "";
  audioContainer.appendChild(audio);

  // Reproducir el audio
  audio.play();
  playBtnLike.onclick = () => {
    audio.play();
    
  };
}
function miniaturaAudio(data) {
  const playBtns = document.querySelectorAll(".playBtn");

  playBtns.forEach((button) => {
    button.addEventListener("click", (event) => {
      // Acceder al botón que se hizo clic
      const playBtn = event.currentTarget;
      // Guardamos en variables los datos cercanos al evento
      const audioSrc = playBtn.getAttribute("data-audio");
      const card = playBtn.closest(".cardId");
      const img = card.querySelector(".imgCard").getAttribute("src");
      const title = card.querySelector(".title").innerText;
      const author = card.querySelector(".author").innerText;

      agregarMiniAudio(title, author, audioSrc, img);
    });
  });
}

function playList(data) {
  const likeBtns = document.querySelectorAll(".likeBtn");
  likeBtns.forEach((button) => {
    button.addEventListener("click", (event) => {
      const likeBtn = event.currentTarget;

      const card = likeBtn.closest(".cardId");
      const img = card.querySelector(".imgCard").getAttribute("src");
      const title = card.querySelector(".title").innerText;
      const author = card.querySelector(".author").innerText;
      const audioSrc = card
        .querySelector(".playBtn")
        .getAttribute("data-audio");
      agregarPlayList(title, author, audioSrc, img);
      Toastify({
        text: `Agregado a la Play List`,
        duration: 5000,
        destination: "https://github.com/apvarun/toastify-js",
        newWindow: true,
        close: true,
        gravity: "top", // `top` or `bottom`
        position: "right", // `left`, `center` or `right`
        stopOnFocus: true, // Prevents dismissing of toast on hover
        style: {
          background: "linear-gradient(to right, #202020, #202020)",
        },
        onClick: function(){} // Callback after click
      }).showToast();
    });
  });
}

function agregarMiniAudio(title, author, audioSrc, img) {
  const miniAudios = document.getElementById("miniAudio");
  miniAudios.innerHTML = "";
  miniAudios.innerHTML = `
            <div class="mini-audio flex">
                <img class=" h-24" src="${img}" alt="Imagen de la canción">
                <div class="info ml-4">
                    <h3 class="text-base text-gray-400">Reproduciendo:<h3/>
                    <h2 class="text-xl">${title}</h2>
                    <p>${author}</p>
                </div>
                </div>
                `;
  // <audio controls src="${audioSrc}"></audio>
}

// agrega canciones a la PLayList
function agregarPlayList(title, author, audioSrc, img) {
  localStorage.setItem("arrPlayList", JSON.stringify(arrPlayList));

  arrPlayList.push(new PlayLists(img, title, author, audioSrc));
  const tablePlayList = document.getElementById("tablePlayList");
  tablePlayList.innerHTML = "";

  renderPlayList();
  
}

function renderPlayList() {
  localStorage.setItem("arrPlayList", JSON.stringify(arrPlayList));

  arrPlayList.map((elemento, index) => {
    const tr = document.createElement("tr");
    tr.innerHTML = "";
    tablePlayList.append(tr);

    if (elemento.title !== undefined) {
      const th = document.createElement("th");

      tr.append(th);
      th.innerHTML = `
      <div class="mini-like flex justify-between w-[100%] border-b-[1px] border-gray-600 pb-2 mb-2">
      <img class="h-20" src="${elemento.img}" alt="Imagen de la canción">
      <div class="like-info ml-2 w-[204px]">
      <h2 class="text-start text-sm">${elemento.title}</h2>
      <p class="text-start text-sm">${elemento.author}</p>
      </div>
      <div class="BtnsLike flex flex-col justify-between gap-4">
      <button
      id="playBtnLike_${index}"
      data-audio="${elemento.audioSrc}" 
      class="bg-green-600 rounded-full h-7 w-7 align-middle items-center">
          <i class="text-xl bi bi-play-circle align-middle"></i>
          </button>
          
          <button
          id="deleteBtn_${index}"
          class="rounded-full  h-7 w-7 align-middle items-center">
          <i class="text-base text-gray-200 bi bi-trash3"></i>
          </button>
          </div>
          </div>
          
          `;
      const playBtnLike = document.getElementById(`playBtnLike_${index}`);
      playBtnLike.addEventListener("click", () => {
        reproducirAudio(elemento.audioSrc); // Llama a la función reproducirAudio con la URL de audio correspondiente
        agregarMiniAudio(
          elemento.title,
          elemento.author,
          (audioSrc = 0),
          elemento.img
        );
        Toastify({
          text: `Reproduciendo ${elemento.title}`,
          duration: 5000,
          destination: "https://github.com/apvarun/toastify-js",
          newWindow: true,
          close: true,
          gravity: "top", // `top` or `bottom`
          position: "right", // `left`, `center` or `right`
          stopOnFocus: true, // Prevents dismissing of toast on hover
          style: {
            background: "linear-gradient(to right, #202020, #202020)",
          },
          onClick: function(){} // Callback after click
        }).showToast();
      });

      const deleteBtn = document.getElementById(`deleteBtn_${index}`);
      deleteBtn.addEventListener("click", () => {
        eliminarDePlayList(index);  // Llama a la función para eliminar el elemento de la lista de reproducción
        Toastify({
          text: `Eliminado de la Play List ${elemento.title}`,
          duration: 5000,
          destination: "https://github.com/apvarun/toastify-js",
          newWindow: true,
          close: true,
          gravity: "top", // `top` or `bottom`
          position: "right", // `left`, `center` or `right`
          stopOnFocus: true, // Prevents dismissing of toast on hover
          style: {
            background: "linear-gradient(to right, #202020, #202020)",
          },
          onClick: function(){} // Callback after click
        }).showToast();
      });
    }
  });
}

function eliminarDePlayList(index) {
  arrPlayList.splice(index, 1); // Elimina el elemento de la lista de reproducción en el índice especificado
  agregarPlayList(); // Vuelve a renderizar la lista de reproducción para reflejar los cambios
}

const inputBusqueda = document.getElementById("inputBuscar");
const rederBusqueda = document.getElementById("busqueda");
// Busca Canciones por title o author
inputBusqueda.addEventListener("keyup", (event) => {
  const filtro = arrData.filter((cancion) => {
    
    return `${cancion.title.toLowerCase()} ${cancion.author.toLowerCase()}`.includes(
      inputBusqueda.value.toLowerCase()
    );
  });

  // Redenrizar el array de canciones filtradas a HTML
  
  const resultadosHTML = filtro.map((cancion, index) => {

  // const playBtnSearch = document.getElementById(`playBtnSearch_${index}`);
  // playBtnSearch.addEventListener("click", () => {
  //   console.log(playBtnSearch);

  // })
      // playBtnLike.addEventListener("click", () => {
      //   reproducirAudio(cancion.audioSrc); // Llama a la función reproducirAudio con la URL de audio correspondiente
      //   // agregarMiniAudio(
      //   //   cancion.title,
      //   //   cancion.author,
      //   //   (audioSrc = 0),
      //   //   cancion.img
      //   // );
      // });

      return `
    <div class="contenedor-busqueda">
    </div>
    <div class="cardId img-container w-24 h-[50%] rounded-lg overflow-hidden relative flex flex-col">
    <button 
    id="likeBtn" 
    class="likeBtn rounded-full w-14 h-14 sticky mt-0 top-0 left-0 z-10 opacity-75 transition delay-75 ease-in-out " 
    >
    <i class="text-red-600 text-2xl hover:text-3xl bi bi-heart-fill shadow-slate-800 drop-shadow-lg"></i>
    </button>
    <img class="imgCard rounded-lg max-w-[100%] object-cover top-0 absolute" src="${cancion.path.front}">
    <button 
    id="playBtnSearch_${index}" 
    class=" playBtn bg-green-600 rounded-full w-16 h-16 absolute mt-0 bottom-0 left-32 opacity-75 transition delay-75 ease-in-out shadow-slate-800 shadow-lg" 
    data-audio="${cancion.path.audio}"
    >
    <i class="text-4xl bi bi-play-circle align-middle"></i>
    </button>
    <div class="text-container z-20">            
    <h2 class="title text-lg text-wrap sm:text-sm w-52"><strong>Titulo: ${cancion.title}</strong></h2>
    <h2 class="author text-sm text-wrap w-52">Author: ${cancion.author}</h2>
    </div>
    </div>
    </div>
    `;
    
    })
    
    .join(" ");

  rederBusqueda.innerHTML = `${resultadosHTML}`;
  console.log(filtro);
});






