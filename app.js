let template_table = document.getElementById("tmp-table").content,
    fragment = document.createDocumentFragment(),
    textPage = document.getElementById("page"),
    arregloDeArreglos = [],
    dataLocal,
    newDataLocal,
    id,
    page = 0;

window.addEventListener('DOMContentLoaded', () => {
    if (!localStorage.data) {
        get_api();
    } else {
        dataLocal = JSON.parse(localStorage.data);
    }
    textPage.textContent = page + 1;
    pagination(dataLocal);
    click();
});

async function ajax(url, options) {
    try {
        let res = await fetch(url, options);
        if (!res.ok) throw { status: res.status, statusText: res.statusText };
        let data = await res.json();
        return data;
    } catch (err) {
        console.log(err);
    }
}

async function get_api() {
    let URL = "https://jsonplaceholder.typicode.com/todos/";
    let data = await ajax(URL);
    localStorage.setItem('data', JSON.stringify(data));
    dataLocal = JSON.parse(localStorage.data);
    pagination(dataLocal);
}

async function pagination(dataLocal) {
    if (dataLocal) {
        const LONGITUD = 10;
        for (let i = 0; i < dataLocal.length; i += LONGITUD) {
            let pedazo = dataLocal.slice(i, i + LONGITUD);
            arregloDeArreglos.push(pedazo);
        }
        paint_data(arregloDeArreglos, page)
    }
}

async function paint_data(arregloDeArreglos, page) {
    if (arregloDeArreglos) {
        document.querySelector('tbody').innerHTML = '';

        arregloDeArreglos[page].forEach((element, index) => {
            let { userId, id, title, completed } = element;
            template_table.querySelector('.userId').textContent = userId;
            template_table.querySelector('.id').textContent = id;
            template_table.querySelector('.title').textContent = title;
            template_table.querySelector('.completed').textContent = completed;
            template_table.querySelector('.edit').innerHTML = `<button class="btn btn-outline-primary edit" data-id=${id} type="submit" data-bs-toggle="modal" data-bs-target="#modalEdit">Edit</button>`;
            template_table.querySelector('.delete').innerHTML = `<button class="btn btn-outline-danger delete" data-id=${id} type="submit">Delete</button>`;

            let $clone = document.importNode(template_table, true);
            fragment.appendChild($clone);

            document.querySelector('tbody').appendChild(fragment);
        });
    }
}
function click() {
    document.addEventListener('click', async (e) => {
        if (e.target.matches('.edit')) {
            dataLocal.forEach(item => {
                if (item.id == e.target.dataset.id) {
                    document.querySelector("#txtId").value = item.id;
                    document.querySelector("#txtUserId").value = item.userId;
                    document.querySelector("#txtTitle").value = item.title;
                    document.querySelector("#txtCompleted").value = item.completed;
                    id = e.target.dataset.id;
                }
            });
        }
        if (e.target.matches('.save')) {
            dataLocal.forEach(item => {
                if (item.id == id) {
                    item.userId = document.querySelector("#txtUserId").value;
                    item.title = document.querySelector("#txtTitle").value;
                    item.completed = document.querySelector("#txtCompleted").value;
                    localStorage.clear();
                    localStorage.setItem('data', JSON.stringify(dataLocal));
                    document.querySelector('tbody').innerHTML = '';
                    pagination(dataLocal);
                }
            });
        }
        if (e.target.matches('.delete')) {
            newDataLocal = dataLocal.filter(item => item.id !== parseInt(e.target.dataset.id));
            document.querySelector('tbody').innerHTML = '';
            localStorage.clear();
            dataLocal = newDataLocal;
            localStorage.setItem('data', JSON.stringify(dataLocal));
            location.reload();
        }
        if (e.target.matches('#btnPrevious') || e.target.matches('#btnPrevious *')) {
            page--;
            if (arregloDeArreglos[page]) {
                paint_data(arregloDeArreglos, page)
                textPage.textContent = page + 1;
            } else {
                page = arregloDeArreglos.length - 1;
                paint_data(arregloDeArreglos, page);
                textPage.textContent = page + 1;
            }
        }
        if (e.target.matches('#btnNext') || e.target.matches('#btnNext *')) {
            page++;
            if (arregloDeArreglos[page]) {
                paint_data(arregloDeArreglos, page)
                textPage.textContent = page + 1;
            } else {
                page = 0;
                paint_data(arregloDeArreglos, page)
                textPage.textContent = page + 1;
            }
        }
        if (e.target.matches('#btnReset') || e.target.matches('#btnReset *')) {
            localStorage.clear();
            for (let i = dataLocal.length; i > 0; i--) {
                dataLocal.pop();
            }
            document.querySelector('tbody').innerHTML = '';
            location.reload();

        }
    });
}