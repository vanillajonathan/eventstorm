<template>
  <div class="modal fade" id="keyboardShortcutsModal" tabindex="-1" aria-hidden="true">
    <div class="modal-dialog">
      <div class="modal-content">
        <div class="modal-header">
          <h1 class="modal-title fs-5" id="exampleModalLabel">Keyboard Shortcuts</h1>
          <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
        <div class="modal-body">
          <table>
            <tbody>
              <tr>
                <td><kbd>+</kbd></td>
                <td>Zoom in</td>
              </tr>
              <tr>
                <td><kbd>-</kbd></td>
                <td>Zoom out</td>
              </tr>
              <tr>
                <td><kbd class="me-2"><kbd>Ctrl</kbd> + <kbd>0</kbd></kbd></td>
                <td>Reset zoom</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>
