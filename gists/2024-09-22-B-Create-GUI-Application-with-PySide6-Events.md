1. **`basic/events_1.py`**

```python
from __future__ import annotations

import sys

from PySide6.QtGui import QMouseEvent
from PySide6.QtWidgets import (
    QApplication,
    QLabel,
    QMainWindow,
    QWidget,
)


class MainWindow(QMainWindow):
    def __init__(self, parent: QWidget | None = None) -> None:
        super().__init__(parent)
        self.label = QLabel("Click in this window")
        self.setCentralWidget(self.label)

    def mouseMoveEvent(self, event: QMouseEvent) -> None:
        self.label.setText("mouseMoveEvent")

    def mousePressEvent(self, event: QMouseEvent) -> None:
        self.label.setText("mousePressEvent")

    def mouseReleaseEvent(self, event: QMouseEvent) -> None:
        self.label.setText("mouseReleaseEvent")

    def mouseDoubleClickEvent(self, event: QMouseEvent) -> None:
        self.label.setText("mouseDoubleClickEvent")


app = QApplication(sys.argv)

window = MainWindow()
window.show()

app.exec()
```

1. **`basic/events_2.py`**

```python
from __future__ import annotations

import sys

from PySide6.QtGui import QMouseEvent
from PySide6.QtWidgets import (
    QApplication,
    QLabel,
    QMainWindow,
    QWidget,
)


class MainWindow(QMainWindow):
    def __init__(self, parent: QWidget | None = None) -> None:
        super().__init__(parent)
        self.label = QLabel("Click in this window")
        self.setCentralWidget(self.label)

    def mouseMoveEvent(self, event: QMouseEvent) -> None:
        self.label.setText("mouseMoveEvent")

    def mousePressEvent(self, event: QMouseEvent) -> None:
        self.label.setText("mousePressEvent")

    def mouseReleaseEvent(self, event: QMouseEvent) -> None:
        self.label.setText("mouseReleaseEvent")

    def mouseDoubleClickEvent(self, event: QMouseEvent) -> None:
        self.label.setText("mouseDoubleClickEvent")


app = QApplication(sys.argv)

window = MainWindow()
window.show()

app.exec()
```

1. **`basic/events_3.py`**

```python
from __future__ import annotations

import sys

from PySide6.QtGui import QAction, QContextMenuEvent
from PySide6.QtWidgets import (
    QApplication,
    QMainWindow,
    QMenu,
    QWidget,
)


class MainWindow(QMainWindow):
    def __init__(self, parent: QWidget | None = None) -> None:
        super().__init__(parent)

    def contextMenuEvent(self, event: QContextMenuEvent) -> None:
        context = QMenu(self)
        context.addAction(QAction("test 1", self))
        context.addAction(QAction("test 2", self))
        context.addAction(QAction("test 3", self))
        context.exec(event.globalPos())


app = QApplication(sys.argv)

window = MainWindow()
window.show()

app.exec()
```

1. **`basic/events_4.py`**

```python
from __future__ import annotations

import sys

from PySide6.QtCore import Qt
from PySide6.QtGui import QAction
from PySide6.QtWidgets import (
    QApplication,
    QMainWindow,
    QMenu,
    QWidget,
)


class MainWindow(QMainWindow):
    def __init__(self, parent: QWidget | None = None) -> None:
        super().__init__(parent)
        self.show()

        self.setContextMenuPolicy(Qt.CustomContextMenu)
        self.customContextMenuRequested.connect(self.on_context_menu)

    def on_context_menu(self, pos) -> None:
        context = QMenu(self)
        context.addAction(QAction("test 1", self))
        context.addAction(QAction("test 2", self))
        context.addAction(QAction("test 3", self))
        context.exec(self.mapToGlobal(pos))


app = QApplication(sys.argv)

window = MainWindow()
window.show()

app.exec()
```
