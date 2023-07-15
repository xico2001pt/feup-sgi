import { PickingTypes } from "../game/PickingTypes.js";
import {PickableComponentNode} from "../models/graph/PickableComponentNode.js";
import {EditedComponentNode} from "../models/graph/EditedComponentNode.js";
import { MyTile } from "../primitives/MyTile.js";
import { PrimitiveNode } from "../models/graph/PrimitiveNode.js";
import { BasicComponentNode } from "../models/graph/BasicComponentNode.js";

/**
 * Class responsible for rendering a Board
 */
export class BoardRenderer {
    /**
     * @param {Scene} scene - Reference to the Scene
     */
    constructor(scene) {
        this.scene = scene;
        this.tileWidth = 1/8;
        this.tilePrimitive = new PrimitiveNode("_tile", new MyTile(scene));
        this.boardHeight = 0.2;
    }

    /**
     * Displays the given board.
     * Should be called every frame.
     * @param {MyGameBoard} board - Reference to Board
     * @param {MyAuxiliaryBoard} auxiliaryBoard - Reference to auxiliary Board
     * @param {MyAnimationTracker} animations - Reference to Animations
     * @param {MyPiece} selectedPiece - Reference to selected Piece
     */
    display(board, auxiliaryBoard, animations, selectedPiece) {
        const numRows = board.board.length;
        const numCols = board.board[0].length;

        const boardsetComponent = this.scene.sceneData.components["boardset"];
        const newChildComponents = [];
        for (const child of boardsetComponent.getChildComponents()) {
            if(!child.getId().startsWith("_")) {
                newChildComponents.push(child);
            }
        }

        for (let i = 0; i < numRows; ++i) {
            for (let j = 0; j < numCols; ++j) {
                const tile = board.board[i][j];
                const pickingId = i*numCols+j+1+PickingTypes.TileSelection;

                if(tile.piece) {
                    const animation = animations != null ? animations.getAnimation(tile.piece.id) : null;
                    newChildComponents.push(this.createPickablePiece(tile.piece, pickingId, animation, selectedPiece));
                }
                newChildComponents.push(this.createPickableTile(tile, pickingId));
            }
        }
        this.displayAuxiliarBoard(auxiliaryBoard, newChildComponents, animations);

        boardsetComponent.setChildren(newChildComponents, boardsetComponent.getChildPrimitives());
    }

    /**
     * Displays the given auxiliary board.
     * Should be called every frame.
     * @param {MyAuxiliaryBoard} auxiliaryBoard - Reference to auxiliary Board
     * @param {Array} outputComponents - Array to which the auxiliary board components will be added
     * @param {MyAnimationTracker} animations - Reference to Animations
     */
    displayAuxiliarBoard(auxiliaryBoard, outputComponents, animations) {
        for (const playerId of [0, 1]) {
            for (const tile of auxiliaryBoard.board[playerId]) {
                if(tile.piece) {
                    const animation = animations != null ? animations.getAnimation(tile.piece.id) : null;
                    outputComponents.push(this.createPiece(tile.piece, animation));
                }
            }
        }
    }

    /**
     * Returns the offsets of the given tile
     * @param {MyTile} tile - Reference to Tile
     * @returns {Array} - Array containing the offsets
     */
    getTileOffsets(tile) {
        const colOffset = (tile.col-4) * this.tileWidth + this.tileWidth/2;
        const rowOffset = (tile.row-4) * this.tileWidth + this.tileWidth/2;
        return [colOffset, rowOffset];
    }

    /**
     * Creates a pickable tile
     * @param {MyTile} tile - Reference to Tile
     * @param {Number} pickingId - Picking ID
     * @returns {PickableComponentNode} - Pickable tile
     */
    createPickableTile(tile, pickingId) {
        const [colOffset, rowOffset] = this.getTileOffsets(tile);

        const transformation = mat4.create();
        mat4.translate(transformation, transformation, [colOffset, this.boardHeight / 2, rowOffset]);

        const component = new BasicComponentNode("_tile"+pickingId, transformation, [this.tilePrimitive]);
        return new PickableComponentNode("_tile"+pickingId, component, pickingId, tile);
    }

    /**
     * Creates a pickable piece
     * @param {MyPiece} piece - Reference to Piece
     * @param {Number} pickingId - Picking ID
     * @param {MyAnimation} animation - Reference to Animation
     * @param {MyPiece} selectedPiece - Reference to selected Piece
     * @returns {PickableComponentNode} - Pickable piece
     */
    createPickablePiece(piece, pickingId, animation, selectedPiece) {
        const pieceComponent = this.createPiece(piece, animation, selectedPiece);
        return new PickableComponentNode("_piece" + piece.id, pieceComponent, pickingId, piece.tile);
    }

    /**
     * Creates a piece
     * @param {MyPiece} piece - Reference to Piece
     * @param {MyAnimation} animation - Reference to Animation
     * @param {MyPiece} selectedPiece - Reference to selected Piece
     * @returns {EditedComponentNode} - Piece
     */
    createPiece(piece, animation=null, selectedPiece=null) {
        let componentName = piece.isKing ? "kingpiece" : "piece";
        if (piece == selectedPiece) {
            componentName = "selected_" + componentName;
        }
        const component = this.scene.sceneData.components[componentName + piece.playerId];
        const [colOffset, rowOffset] = this.getTileOffsets(piece.tile);

        const transformation = mat4.create();
        mat4.translate(transformation, transformation, [colOffset, this.boardHeight / 2, rowOffset]);
        
        return new EditedComponentNode("_piece" + piece.id, component, transformation, [this.tilePrimitive], animation);
    }
}