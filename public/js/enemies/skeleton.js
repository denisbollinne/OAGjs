/**
 * Created by JetBrains WebStorm.
 * User: Maarten De Wilde
 * Date: 14/03/12
 * Time: 17:51
 */
GAME.skeleton = function(gs){

    var animations = new GAME.AnimationFactory();


    var skeletonAnimations = new GAME.Animations();
    skeletonAnimations.runWest = animations.createAnimations("skeleton/skel rennt w",9,2);
    skeletonAnimations.runEast = animations.createAnimations("skeleton/skel rennt e",9,2);
    skeletonAnimations.runNorth = animations.createAnimations("skeleton/skel rennt n",9,2);
    skeletonAnimations.runSouth = animations.createAnimations("skeleton/skel rennt s",9,2);
    skeletonAnimations.runNorthWest = animations.createAnimations("skeleton/skel rennt nw",9,2);
    skeletonAnimations.runNorthEast = animations.createAnimations("skeleton/skel rennt ne",9,2);
    skeletonAnimations.runSouthWest = animations.createAnimations("skeleton/skel rennt sw",9,2);
    skeletonAnimations.runSouthEast = animations.createAnimations("skeleton/skel rennt se",9,2);
    skeletonAnimations.standWest = animations.createAnimations("skeleton/macht faxen w",1,2);
    skeletonAnimations.standEast = animations.createAnimations("skeleton/macht faxen e",1,2);
    skeletonAnimations.standNorth = animations.createAnimations("skeleton/macht faxen n",1,2);
    skeletonAnimations.standSouth = animations.createAnimations("skeleton/macht faxen s",1,2);
    skeletonAnimations.standNorthWest = animations.createAnimations("skeleton/macht faxen nw",1,2);
    skeletonAnimations.standNorthEast = animations.createAnimations("skeleton/macht faxen ne",1,2);
    skeletonAnimations.standSouthWest = animations.createAnimations("skeleton/macht faxen sw",1,2);
    skeletonAnimations.standSouthEast = animations.createAnimations("skeleton/macht faxen se",1,2);
    var startPosition = new Array();
    startPosition[0] = 800;
    startPosition[1] = 600;

    this.character = new GAME.Character(gs, skeletonAnimations, startPosition, false);
};