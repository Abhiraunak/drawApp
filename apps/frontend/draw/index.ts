export function initDraw(canvas: HTMLCanvasElement) {
    const ctx = canvas.getContext("2d");

    if (!ctx) return;

    ctx.fillStyle = "black";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    let clicked = false;
    let startX = 0;
    let startY = 0;

    function getMousePos(e: MouseEvent) {
        const rect = canvas.getBoundingClientRect();
        return {
            x: e.clientX - rect.left,
            y: e.clientY - rect.top
        };
    }

    canvas.addEventListener("mousedown", (e) => {
        clicked = true;
        const pos = getMousePos(e);
        startX = pos.x;
        startY = pos.y;
    });

    canvas.addEventListener("mouseup", () => {
        clicked = false;
    });

    canvas.addEventListener("mousemove", (e) => {
        if (!clicked || !ctx) return;

        const pos = getMousePos(e);
        const width = pos.x - startX;
        const height = pos.y - startY;

        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillStyle = "black";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.strokeStyle = "white";
        ctx.strokeRect(startX, startY, width, height);
    });
}
