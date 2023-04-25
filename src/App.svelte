<script lang="ts">
  import { onMount } from "svelte";
  import * as __3JS__ from "three";

  let canvas: HTMLCanvasElement


  let __3js__renderer: __3JS__.WebGLRenderer
  let __3js__camera  : __3JS__.PerspectiveCamera

  const __3js__scene    = new __3JS__.Scene()
  const __3js__geometry = new __3JS__.BoxGeometry( 1, 1, 1 );
  const __3js__material = new __3JS__.MeshBasicMaterial( { color: 0x00ff00 } );
  const __3js__cube = new __3JS__.Mesh( __3js__geometry, __3js__material );
  __3js__scene.add( __3js__cube );


  onMount(async () => {
    // position canvas
    canvas.style.position = "absolute"
    canvas.style.top      =   "0px"
    canvas.style.left     =   "0px"
    canvas.style.width    = "100vw"
    canvas.style.height   = "100vh"
    canvas.style.backgroundColor = "#000"

    new ResizeObserver(() => onResize()).observe(canvas)

    // init three
    __3js__renderer = new __3JS__.WebGLRenderer({ canvas })
    __3js__camera   = new __3JS__.PerspectiveCamera(75, canvas.width / canvas.height, .1, 1000)
    __3js__camera.position.z = 5;

    requestAnimationFrame(
      t0 => requestAnimationFrame(
        t1 => animate( t0, t1, t1 )))
  })

  function onResize() {
    canvas.width  = canvas.getBoundingClientRect().width
    canvas.height = canvas.getBoundingClientRect().height
    __3js__renderer.setSize(canvas.width, canvas.height)

    __3js__camera.aspect = canvas.width / canvas.height
    __3js__camera.updateProjectionMatrix()
  }

  function onUpdate(t, dt) {
    __3js__cube.rotation.x += 1 * dt;
    __3js__cube.rotation.y += 1 * dt;
  }

  function onRender(t, dt) {
    __3js__renderer.render(__3js__scene, __3js__camera)
  }

  function animate(t0, t1, t2) {
    const
      t  = (t2 - t0) / 1000,
      dt = (t2 - t1) / 1000;
    onUpdate(t, dt)
    onRender(t, dt)
    requestAnimationFrame(t3 => animate(t0, t2, t3))
  }

</script>

<canvas bind:this={canvas}></canvas>
