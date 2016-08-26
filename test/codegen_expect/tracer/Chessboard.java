package tracer;

public class Chessboard extends tracer.Materials
{
    public static dart._runtime.types.simple.InterfaceTypeInfo dart2java$typeInfo = new dart._runtime.types.simple.InterfaceTypeInfo("file:///usr/local/google/home/andrewkrieger/ddc-java/gen/codegen_tests/tracer.dart", "Chessboard");
    static {
      tracer.Chessboard.dart2java$typeInfo.superclass = new dart._runtime.types.simple.InterfaceTypeExpr(tracer.Materials.dart2java$typeInfo);
    }
    public tracer.Color colorEven;
    public tracer.Color colorOdd;
    public java.lang.Double density;
  
    public Chessboard(dart._runtime.types.simple.Type type, tracer.Color colorEven, tracer.Color colorOdd, java.lang.Object reflection, java.lang.Object transparency, java.lang.Object gloss, java.lang.Double density)
    {
      super((dart._runtime.helpers.ConstructorHelper.EmptyConstructorMarker) null, type);
      this._constructor(colorEven, colorOdd, reflection, transparency, gloss, density);
    }
    public Chessboard(dart._runtime.helpers.ConstructorHelper.EmptyConstructorMarker arg, dart._runtime.types.simple.Type type)
    {
      super(arg, type);
    }
  
    protected void _constructor(tracer.Color colorEven, tracer.Color colorOdd, java.lang.Object reflection, java.lang.Object transparency, java.lang.Object gloss, java.lang.Double density)
    {
      final dart._runtime.types.simple.TypeEnvironment dart2java$localTypeEnv = this.dart2java$type.env;
      this.colorEven = colorEven;
      this.colorOdd = colorOdd;
      this.density = density;
      super._constructor((java.lang.Double) reflection, (java.lang.Double) transparency, (java.lang.Double) gloss, 0.5, true);
    }
    public tracer.Color getColor_(java.lang.Number u, java.lang.Number v)
    {
      final dart._runtime.types.simple.TypeEnvironment dart2java$localTypeEnv = this.dart2java$type.env;
      java.lang.Object t = dart._runtime.helpers.DynamicHelper.invoke("operatorStar", this.wrapUp(dart._runtime.helpers.NumberHelper.operatorStar(u, this.getDensity())), this.wrapUp(dart._runtime.helpers.NumberHelper.operatorStar(v, this.getDensity())));
      if ((java.lang.Boolean) dart._runtime.helpers.DynamicHelper.invoke("operatorLess", t, 0.0))
      {
        return this.getColorEven();
      }
      else
      {
        return this.getColorOdd();
      }
    }
    public tracer.Color getColorEven()
    {
      return this.colorEven;
    }
    public tracer.Color getColorOdd()
    {
      return this.colorOdd;
    }
    public java.lang.Double getDensity()
    {
      return this.density;
    }
}